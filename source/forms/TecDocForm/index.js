//vendor
import React, { Component } from "react";
import { Tree, Table, Button, Modal, List } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { v4 } from "uuid";
import _ from "lodash";

// proj
import {
    onChangeTecDocForm,
    fetchSections,
    fetchParts,
    fetchCrosses,
    fetchAttributes,
    clearAttributes,
} from "core/forms/tecDocForm/duck";
import { AddClientVehicleForm } from "forms";

import { withReduxForm2 } from "utils";

// own
import Styles from "./styles.m.css";

const TreeNode = Tree.TreeNode;

@injectIntl
@withReduxForm2({
    name: "tecDoc",
    actions: {
        change: onChangeTecDocForm,
        fetchSections,
        fetchParts,
        fetchCrosses,
        fetchAttributes,
        clearAttributes,
    },
})
export class TecDocForm extends Component {
    constructor(props) {
        super(props);
        this.state = { vehicle: null };
        this.columns = [
            {
                title: <FormattedMessage id="tecdoc.supplierName" />,
                dataIndex: "supplierName",
                width: "15%",
            },
            {
                title: <FormattedMessage id="tecdoc.partNumber" />,
                dataIndex: "partNumber",
                width: "15%",
            },
            {
                title: <FormattedMessage id="tecdoc.description" />,
                dataIndex: "description",
                width: "20%",
            },
            {
                title: <FormattedMessage id="tecdoc.attributes" />,
                key: "attributes",
                width: "20%",
                render: ({ supplierId, partNumber }) => (
                    <Button
                        onClick={() => {
                            this.props.fetchAttributes(partNumber, supplierId);
                        }}
                    >
                        Attributes
                    </Button>
                ),
            },
        ];
    }

    onSelect = (selectedKeys, { node: { props: sectionsProps } }) => {
        const {
            dataRef: { id },
        } = sectionsProps;
        const {
            vehicle: { tecdocId },
        } = this.state;
        this.props.fetchParts(tecdocId, id);
    };

    onCrossesExpand = (expanded, { partNumber, children }) => {
        if (expanded && children.fake) {
            this.props.fetchCrosses(partNumber);
        }
    };

    onExpand = (expandedKey, { node: { props: sectionProps }, expanded }) => {
        const {
            vehicle: { tecdocId },
        } = this.state;

        if (expanded) {
            const {
                isLoaded,
                dataRef: { id },
            } = sectionProps;
            if (!isLoaded) {
                this.props.fetchSections(id, tecdocId);
            }
        }
    };

    renderTreeNodes = sections => {
        const {
            vehicle: { tecdocId },
        } = this.state;

        return sections.map(section => {
            const {
                description,
                hasChildren,
                id,
                children = [{ description: "...", id: v4() }],
            } = section;
            const isLoaded = Boolean(section.children);

            if (hasChildren) {
                return (
                    <TreeNode
                        isLoaded={isLoaded}
                        title={description}
                        key={`${tecdocId}-${id}`}
                        selectable={false}
                        dataRef={section}
                    >
                        {this.renderTreeNodes(children)}
                    </TreeNode>
                );
            }

            return (
                <TreeNode
                    onClick={() => this.fetchParts(id)}
                    title={description}
                    key={`${tecdocId}-${id}`}
                    dataRef={section}
                />
            );
        });
    };

    render() {
        const { sections = [], parts: initParts = [] } = this.props;

        const parts = initParts.map(initPart => ({
            ...initPart,
            key: v4(),
        }));

        return (
            <>
                <AddClientVehicleForm
                    onlyVehicles
                    tecdoc
                    addClientVehicle={vehicle => {
                        if (vehicle.tecdocId) {
                            this.setState({ vehicle });
                            this.props.fetchSections(0, vehicle.tecdocId);
                        }
                    }}
                />
                {this.state.vehicle && (
                    <div>
                        <Table
                            onExpand={this.onCrossesExpand}
                            size="small"
                            dataSource={parts}
                            columns={this.columns}
                        />
                        <Tree onExpand={this.onExpand} onSelect={this.onSelect}>
                            {this.renderTreeNodes(sections)}
                        </Tree>
                    </div>
                )}
                {this.props.attributes && (
                    <Modal
                        title="TecDoc"
                        cancelText={<FormattedMessage id="cancel" />}
                        visible={this.props.attributes}
                        onOk={() => this.props.clearAttributes()}
                        onCancel={() => this.props.clearAttributes()}
                        maskClosable={false}
                    >
                        <List
                            bordered
                            dataSource={this.props.attributes}
                            renderItem={item => (
                                <List.Item>
                                    {item.description + ": " + item.value}
                                </List.Item>
                            )}
                        />
                    </Modal>
                )}
            </>
        );
    }
}
