// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Tree, Input, Icon, Button } from "antd";
import styled from "styled-components";

// proj
import { StoreGroupModal } from "modals";
import { setModal, resetModal, MODALS } from "core/modals/duck";

// own
import { StoreProductsSetting } from "./StoreProductsSetting";
const { TreeNode } = Tree;
const Search = Input.Search;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || "0";
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ title: key, key });
        if (i < y) {
            children.push(key);
        }
    }
    if (_level < 0) {
        return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
        tns[index].children = [];

        return generateData(level, key, tns[index].children);
    });
};
generateData(z);

const dataList = [];
const generateList = data => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({ key, title: key });
        if (node.children) {
            generateList(node.children);
        }
    }
};
generateList(gData);

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }

    return parentKey;
};

const mapStateToProps = state => ({
    modal: state.modals.modal,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class StoreProductsContainer extends Component {
    state = {
        expandedKeys: [],
        searchValue: "",
        autoExpandParent: true,
    };

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onChange = e => {
        const value = e.target.value;
        const expandedKeys = dataList
            .map(item => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, gData);
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
                const index = item.title.indexOf(searchValue);
                const beforeStr = item.title.substr(0, index);
                const afterStr = item.title.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: "#f50" }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{item.title}</span>
                    );
                if (item.children) {
                    return (
                        <Leaf
                            key={item.key}
                            title={title}
                            icon={({ selected }) =>
                                selected ? (
                                    <StoreProductsSetting
                                        setModal={this.props.setModal}
                                    />
                                ) : null
                            }
                        >
                            {loop(item.children)}
                        </Leaf>
                    );
                }

                return (
                    <Leaf
                        key={item.key}
                        title={title}
                        icon={item =>
                            item.selected ? (
                                <StoreProductsSetting
                                    setModal={this.props.setModal}
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
                    placeholder="Search"
                    onChange={this.onChange}
                />
                <Button
                    icon="plus"
                    type="dashed"
                    onClick={() =>
                        this.props.setModal(MODALS.STORE_GROUP, {
                            root: true,
                        })
                    }
                >
                    {this.props.intl.formatMessage({
                        id: "storage.add_root_product_group",
                    })}
                </Button>

                <StyledTree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    showIcon
                >
                    {loop(gData)}
                </StyledTree>
                <StoreGroupModal
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
