// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Skeleton } from "antd";
// import { withRouter } from 'react-router-dom';
import styled, { css } from "styled-components";

// proj
import {
    fetchSubscriptionProducts,
    selectSubscriptionProducts,
} from "core/subscription/duck";

import { SubscriptionProduct } from "components";
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
});

// own
@connect(
    mapStateToProps,
    { fetchSubscriptionProducts },
)
export default class SubscriptionProductsContainer extends Component {
    componentDidMount() {
        this.props.fetchSubscriptionProducts();
    }

    render() {
        // this.props.loading ?
        //     this._renderBannersGridSkeleton()
        //     : (
        return (
            <SubscriptionProductsGrid>
                <Card title={this._renderTitle("#pro")} bordered={false}>
                    {this.props.products.rolePackages.map(
                        ({ id, name, price, description, rolesPackageId }) => (
                            <SubscriptionProduct
                                key={id}
                                name={name}
                                price={price}
                                description={description}
                                rolesPackageId={rolesPackageId}
                            />
                        ),
                    )}
                </Card>
                <Card title={this._renderTitle("#advertise")} bordered={false}>
                    {this.props.products.suggestionGroup.map(
                        ({ id, name, price, description, rolesPackageId }) => (
                            <SubscriptionProduct
                                key={id}
                                name={name}
                                price={price}
                                description={description}
                                rolesPackageId={rolesPackageId}
                            />
                        ),
                    )}
                </Card>
            </SubscriptionProductsGrid>
        );
    }

    _renderTitle = id => (
        <h3 id={id}>
            <a
                href={`${book.subscriptionPackagesPage}${id}`}
                className="anchor"
            >
                #
            </a>
        </h3>
    );

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
        margin: 0 24px 24px 24px;
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
