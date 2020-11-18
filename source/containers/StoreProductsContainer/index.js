// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Tree, Input, Icon, Button } from "antd";
import styled from "styled-components";
import _ from "lodash";

// proj
import {
    fetchStoreGroups,
    selectStoreGroups,
    selectFlattenStoreGroups,
} from "core/storage/storeGroups";
import { setModal, resetModal, MODALS } from "core/modals/duck";
import { StoreGroupModal } from "modals";

// own
import { StoreProductsSetting } from "./StoreProductsSetting";
const { TreeNode } = Tree;
const Search = Input.Search;

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.childGroups) {
            if (
                node.childGroups.some(
                    item => item.id === key,
                    // item => item.id === key || item.parentGroupId === key,
                )
            ) {
                parentKey = node.id;
            } else if (getParentKey(key, node.childGroups)) {
                parentKey = getParentKey(key, node.childGroups);
            }
        }
    }

    return Number.isInteger(parentKey) ? String(parentKey) : parentKey;
};

const mapStateToProps = state => ({
    modal: state.modals.modal,
    storeGroups: selectStoreGroups(state),
    flattenStoreGroups: selectFlattenStoreGroups(state),
});

const mapDispatchToProps = {
    fetchStoreGroups,
    setModal,
    resetModal,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class StoreProductsContainer extends Component {
    state = {
        expandedKeys: [],
        searchValue: "",
        autoExpandParent: true,
        brands: [],
    };

    componentDidMount() {
        this.props.fetchStoreGroups();
        this.fetchDetails();
    }

    fetchDetails() {
        let that = this;
        let token = localStorage.getItem("_my.carbook.pro_token");
        let url = __API_URL__;
        let params = `/brands`;
        url += params;

        fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }
                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                that.setState({
                    brands: data,
                });
            })
            .catch(function(error) {
                console.log("error", error);
            });

        url = __API_URL__ + "/business_suppliers?all=true";

        fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }
                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                that.setState({
                    suppliers: data,
                });
            })
            .catch(function(error) {
                console.log("error", error);
            });
    }

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onChange = e => {
        const value = e.target.value;

        const expandedKeys = this.props.flattenStoreGroups
            .map(item => {
                if (
                    String(item.name)
                        .toLowerCase()
                        .indexOf(String(value).toLowerCase()) > -1
                ) {
                    return getParentKey(item.id, this.props.storeGroups);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);

        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;

        const loop = data =>
            data.map(item => {
                const index = String(item.name)
                    .toLowerCase()
                    .indexOf(String(searchValue).toLowerCase());
                const beforeStr = item.name.substr(0, index);
                const afterStr = item.name.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: "#f50" }}>{searchValue}</span>
                            {afterStr} (#{item.id}){" "}
                            {item.brandId ? `/ ${item.brandName}` : ``}{" "}
                            {item.priceGroupNumber
                                ? `/ ${item.priceGroupMultiplier}`
                                : ``}
                        </span>
                    ) : (
                        <span>
                            {item.name} (#{item.id}){" "}
                            {item.brandId ? `/ ${item.brandName}` : ``}{" "}
                            {item.priceGroupNumber
                                ? `/ ${item.priceGroupMultiplier}`
                                : ``}
                        </span>
                    );
                if (!_.isEmpty(item.childGroups)) {
                    return (
                        <Leaf
                            key={String(item.id)}
                            title={title}
                            icon={({ selected }) =>
                                selected ? (
                                    <StoreProductsSetting
                                        setModal={this.props.setModal}
                                        storeGroup={{
                                            id: item.id,
                                            name: item.name,
                                            systemWide: Boolean(
                                                !item.businessId,
                                            ),
                                            priceGroupNumber:
                                                item.priceGroupNumber,
                                            brandId: item.brandId,
                                            fixedBrand: item.fixedBrand,
                                            businessSupplierId:
                                                item.businessSupplierId,
                                        }}
                                    />
                                ) : null
                            }
                        >
                            {loop(item.childGroups)}
                        </Leaf>
                    );
                }

                return (
                    <Leaf
                        key={String(item.id)}
                        title={title}
                        icon={leaf =>
                            leaf.selected ? (
                                <StoreProductsSetting
                                    setModal={this.props.setModal}
                                    storeGroup={{
                                        id: item.id,
                                        name: item.name,
                                        systemWide: Boolean(!item.businessId),
                                        priceGroupNumber: item.priceGroupNumber,
                                        brandId: item.brandId,
                                        fixedBrand: item.fixedBrand,
                                        businessSupplierId:
                                            item.businessSupplierId,
                                    }}
                                />
                            ) : null
                        }
                    />
                );
            });

        return (
            <div>
                <Search
                    style={{ marginBottom: 8 }}
                    placeholder={this.props.intl.formatMessage({
                        id: "storage.search_for_product_group",
                    })}
                    onChange={this.onChange}
                />
                {/*<Button
                    icon="plus"
                    type="dashed"
                    onClick={() =>
                        this.props.setModal(MODALS.STORE_GROUP, {
                            create: true,
                            root: true,
                        })
                    }
                >
                    {this.props.intl.formatMessage({
                        id: "storage.add_root_product_group",
                    })}
                </Button>*/}
                <StyledTree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    showIcon
                >
                    {/* {loop(gData)} */}
                    {loop(this.props.storeGroups)}
                </StyledTree>
                <StoreGroupModal
                    brands={this.state.brands}
                    suppliers={this.state.suppliers}
                    resetModal={this.props.resetModal}
                    visible={this.props.modal}
                />
            </div>
        );
    }
}

const StyledTree = styled(Tree)`
    &.ant-tree {
        overflow: scroll;

        .ant-tree-treenode-selected .ant-tree-title {
            margin-left: 24px;
        }
    }

    &.ant-tree li.ant-tree-treenode-selected .ant-tree-node-selected {
        display: inline-flex;
        position: relative;
        margin-right: 80px;
        border-radius: 2px;

        & .ant-tree-iconEle.ant-tree-icon__customize {
            position: absolute;
            right: -80px;
            width: 80px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            background: rgba(var(--secondaryRGB), 0.2);
        }
    }
`;

const Leaf = styled(TreeNode)`
    /* .ant-tree-node-selected {
        display: inline-flex;
        position: relative;
        margin-right: 80px;
        border-radius: 2px;
    } */

    /* .ant-tree-treenode-selected {
        display: inline-flex;
        position: relative;
        margin-right: 80px;
        border-radius: 2px;
    }

    .ant-tree-treenode-selected .ant-tree-iconEle.ant-tree-icon__customize {
        position: absolute;
        right: -80px;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: rgba(var(--secondaryRGB), 0.2);
    }

    .ant-tree-treenode-selected .ant-tree-title {
        margin-left: 24px;
    } */
`;
