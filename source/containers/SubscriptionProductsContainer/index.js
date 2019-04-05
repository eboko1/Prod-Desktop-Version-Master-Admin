// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Card, Skeleton } from "antd";
import styled, { css } from "styled-components";

// proj
import {
    verifyPromoCode,
    subscribe,
    fetchSubscriptionProducts,
    selectSubscriptionProducts,
    asyncSubscribe,
} from "core/payments/duck";
import { setModal, resetModal, MODALS } from "core/modals/duck";

import { SubscriptionProduct } from "components";
import { SubscribeModal, PDFViewerModal } from "modals";
import book from "routes/book";

const GridCardSkeletonCSS = css`
    & > .ant-skeleton-header {
        padding: 0;

        & .ant-skeleton-avatar-lg {
            height: 350px;
            width: 100%;
        }
    }
`;

const mapStateToProps = state => ({
    products: selectSubscriptionProducts(state),
    user: state.auth,
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
    promoCode: state.payments.promoCode,
    subscribed: state.payments.subscribed,
});

const mapDispatchToProps = {
    fetchSubscriptionProducts,
    verifyPromoCode,
    setModal,
    resetModal,
    subscribe,
    asyncSubscribe,
};

// own
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class SubscriptionProductsContainer extends Component {
    componentDidMount() {
        this.props.fetchSubscriptionProducts();
    }

    _setModal = modalProps => this.props.setModal(MODALS.SUBSCRIBE, modalProps);
    _showDetails = () => this.props.setModal(MODALS.PDF_VIEWER);
    render() {
        return (
            <>
                <SubscriptionProductsGrid>
                    <Card
                        title={
                            <h3>
                                <FormattedMessage id="subscription-table.pro" />
                            </h3>
                        }
                        bordered={false}
                    >
                        {this.props.products.rolePackages.map(
                            ({
                                id,
                                name,
                                price,
                                description,
                                rolesPackageId,
                            }) => (
                                <SubscriptionProduct
                                    key={id}
                                    name={name}
                                    price={price}
                                    description={description}
                                    rolesPackageId={rolesPackageId}
                                    showDetails={() => this._showDetails()}
                                    setModal={() =>
                                        this._setModal({
                                            name,
                                            price,
                                            rolesPackageId,
                                            id,
                                        })
                                    }
                                />
                            ),
                        )}
                    </Card>
                    <Card
                        title={
                            <h3>
                                <FormattedMessage id="subscription-table.advertise" />
                            </h3>
                        }
                        bordered={false}
                    >
                        {this.props.products.suggestionGroup.map(
                            ({
                                id,
                                name,
                                price,
                                description,
                                suggestionGroupId,
                            }) => (
                                <SubscriptionProduct
                                    key={id}
                                    name={name}
                                    price={price}
                                    description={description}
                                    suggestionGroupId={suggestionGroupId}
                                    showDetails={() => this._showDetails()}
                                    setModal={() =>
                                        this._setModal({
                                            name,
                                            price,
                                            suggestionGroupId,
                                            id,
                                        })
                                    }
                                />
                            ),
                        )}
                    </Card>
                </SubscriptionProductsGrid>
                {this.props.modal === MODALS.SUBSCRIBE && (
                    <SubscribeModal
                        visible={this.props.modal}
                        resetModal={this.props.resetModal}
                        modalProps={this.props.modalProps}
                        user={this.props.user}
                        subscribe={this.props.subscribe}
                        verifyPromoCode={this.props.verifyPromoCode}
                        promoCode={this.props.promoCode}
                        subscribed={this.props.subscribed}
                        asyncSubscribe={this.props.asyncSubscribe}
                    />
                )}
                {this.props.modal === MODALS.PDF_VIEWER && (
                    <PDFViewerModal
                        visible={this.props.modal}
                        resetModal={this.props.resetModal}
                    />
                )}
            </>
        );
    }

    _renderBannersSkeleton = () => (
        <Skeleton
            active
            title={false}
            avatar={{ shape: "square" }}
            // loading={ this.props.loading }
            paragraph={0}
            css={GridCardSkeletonCSS}
        />
    );

    _renderBannersGridSkeleton = () => (
        <Card bordered={false}>
            {this._renderBannersSkeleton()}
            {this._renderBannersSkeleton()}
            {this._renderBannersSkeleton()}
        </Card>
    );
}

const SubscriptionProductsGrid = styled.div`
    & .ant-card {
        margin: 24px;
        border: 2px dashed var(--secondary);
    }

    & .ant-card-body {
        padding: 0;
        background-color: rgb(240, 242, 245);
    }
`;
