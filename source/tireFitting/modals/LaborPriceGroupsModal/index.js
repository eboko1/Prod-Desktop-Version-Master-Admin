// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox, Table, notification, InputNumber, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { permissions, isForbidden, fetchAPI } from 'utils';

@injectIntl
export default class LaborPriceGroupsModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
        }

        this.columns = [
            {
                title:      <FormattedMessage id='name'/>,
                key:       'name',
                dataIndex: 'name',
                width:     'auto',
            },
            {
                title:      <FormattedMessage id='vehicleTypeId'/>,
                key:       'vehicleTypeId',
                dataIndex: 'vehicleTypeId',
                width:     'auto',
            },
            {
                title:     <FormattedMessage id='minRadius'/>,
                key:       'minRadius',
                dataIndex: 'minRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={0}
                            max={elem.maxRadius}
                            value={data}
                            onChange={(value)=>{
                                elem.minRadius = value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='maxRadius'/>,
                key:       'maxRadius',
                dataIndex: 'maxRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={elem.minRadius}
                            value={data}
                            onChange={(value)=>{
                                elem.maxRadius = value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='price'/>,
                key:       'price',
                dataIndex: 'price',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={elem.minRadius}
                            value={data}
                            onChange={(value)=>{
                                elem.price = value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
        ]
    }

    fetchData = async () => {
        const { laborId } = this.props;
        const data = await fetchAPI('GET', `labors/price_groups`, {laborId});
        this.setState({
            dataSource: data,
        })
    }

    handleOk = () => {
        this.handleCancel();
    }

    handleCancel = () => {
        this.props.hideModal();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            this.fetchData();
        } 
    }


    render() {
        const { dataSource } = this.state;
        const { laborId, visible } = this.props;
        return (
            <Modal
                visible={visible}
                title={laborId}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </Modal>
        );
    }
}