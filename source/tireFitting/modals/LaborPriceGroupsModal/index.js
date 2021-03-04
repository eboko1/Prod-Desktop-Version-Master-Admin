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

// own
import Styles from './styles.m.css';

@injectIntl
export default class LaborPriceGroupsModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
        }

        this.columns = [
            {
                title:      <FormattedMessage id='tire.name'/>,
                key:       'name',
                dataIndex: 'name',
                width:     'auto',
            },
            {
                title:      <FormattedMessage id='tire.vehicleType'/>,
                key:       'vehicleTypeName',
                dataIndex: 'vehicleTypeName',
                width:     'auto',
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='tire.minRadius' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'minRadius',
                dataIndex: 'minRadius',
                width:     'auto',
                render:     data => Math.round(data)+'R',
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='tire.maxRadius' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'maxRadius',
                dataIndex: 'maxRadius',
                width:     'auto',
                render:     data => Math.round(data)+'R',
            },
            {
                title:   <FormattedMessage id='price' />,
                key:       'price',
                dataIndex: 'price',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={0}
                            value={data || 0}
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

    handleOk = async () => {
        const { laborId } = this.props;
        const { dataSource } = this.state;
        const payload = [];
        dataSource.map(({price, id})=>{
            payload.push({
                laborId,
                tirePriceGroupId: id,
                price: price || 0,
            })
        })
        await fetchAPI('PUT', `labors/price_groups`, undefined, payload);
        await this.handleCancel();
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
                    rowKey={'id'}
                />
            </Modal>
        );
    }
}