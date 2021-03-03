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
import { Layout } from 'tireFitting';
import { permissions, isForbidden, fetchAPI } from 'utils';

// own
const Option = Select.Option;
const MAIN = 'MAIN',
      RESERVE = 'RESERVE',
      TOOL = 'TOOL',
      REPAIR_AREA= 'REPAIR_AREA';

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

const mapDispatchToProps = {
};

@connect(mapStateToProps, mapDispatchToProps)
export default class TirePriceGroupsPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
        }

        this.fetchData = this.fetchData.bind(this);

        this.columns = [
            {
                title:     <FormattedMessage id='id'/>,
                key:       'id',
                dataIndex: 'id',
                width:     'auto',
            },
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
                title:     <FormattedMessage id='visible'/>,
                key:       'visible',
                dataIndex: 'visible',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <Switch
                            checked={data}
                            onChange={(checked)=>{
                                elem.visible = checked;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '5%',
                render:     (elem)=>{
                    return (
                        <Icon
                            type='delete'
                            style={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD) ? {
                                fontSize: 18,
                                color: 'var(--text2)',
                                pointerEvents: 'none',
                            } : {
                                fontSize: 18
                            }}
                            onClick={()=>{
                                if(!isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD))
                                    this.deleteType(elem.id)
                            }}
                        />
                    )
                }
            },
        ]
    }

    fetchData = async () => {
        const data = await fetchAPI('GET', 'tire_station_price_groups');
        this.setState({
            dataSource: data,
        })
    }

    updateGroups = async () => {
        await fetchAPI('PUT', 'tire_station_price_groups', undefined, {

        });
    }

    deleteGroup = async (id) => {
        await fetchAPI('DELETE', 'tire_station_price_groups', {id});
        await this.fetchData();
    }

    importDefault = async () => {
        await fetchAPI('COPY', '/tire_station_price_groups/standard');
        await this.fetchData();
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        const { dataSource } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.vehicle_types' /> }
                controls={
                    <div>
                        <Button
                            type="primary"
                            onClick={this.importDefault}
                        >
                            <FormattedMessage id="importDefault"/>
                        </Button>
                    </div>
                }
            >
                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </Layout>
        );
    }
}