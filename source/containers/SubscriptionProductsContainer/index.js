// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Card, Skeleton } from "antd";
import styled, { css } from "styled-components";

// proj
import {
    fetchSubscriptionProducts,
    selectSubscriptionProducts,
} from "core/subscription/duck";
import { setModal, resetModal, MODALS } from "core/modals/duck";

import { SubscriptionProduct } from "components";
import { SubscribeModal } from "modals";
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
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
});

// own
@connect(
    mapStateToProps,
    { fetchSubscriptionProducts, setModal, resetModal },
)
export default class SubscriptionProductsContainer extends Component {
    componentDidMount() {
        this.props.fetchSubscriptionProducts();
    }

    _setModal = modalProps => this.props.setModal(MODALS.SUBSCRIBE, modalProps);

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
                                    setModal={() =>
                                        this._setModal({
                                            name,
                                            price,
                                            rolesPackageId,
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
                                    setModal={() =>
                                        this._setModal({
                                            name,
                                            price,
                                            suggestionGroupId,
                                        })
                                    }
                                />
                            ),
                        )}
                    </Card>
                </SubscriptionProductsGrid>
                <SubscribeModal
                    visible={this.props.modal}
                    resetModal={this.props.resetModal}
                    modalProps={this.props.modalProps}
                />
            </>
        );
    }

    // _renderTitle = id => (
    //     <h3 id={id}>
    //         <a
    //             href={`${book.subscriptionPackagesPage}${id}`}
    //             className="anchor"
    //         >
    //             #
    //         </a>
    //     </h3>
    // );

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

// proj

// import { media } from 'styles/tools';

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

// const BannersGridContainer = styled(Card)`
//     & .ant-card-body {
//         ${media.md`
//             padding-top: 0;
//             padding-left: 0;
//             padding-right: 0;
//         `}
//     //
//     .ant-card-head-title {
//         ${media.sm`font-size: 32px;`};
//         ${media.xs`font-size: 24px;`};
//     }
// `;
