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
                title:     <FormattedMessage id='tire.minRadius'/>,
                key:       'minRadius',
                dataIndex: 'minRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={0}
                            max={Number(elem.maxRadius)}
                            value={Math.round(data)}
                            onChange={(value)=>{
                                elem.minRadius = value;
                                this.updateGroups();
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='tire.maxRadius'/>,
                key:       'maxRadius',
                dataIndex: 'maxRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={Number(elem.minRadius)}
                            value={Math.round(data)}
                            onChange={(value)=>{
                                elem.maxRadius = value;
                                this.updateGroups();
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='supplier.show'/>,
                key:       'visible',
                dataIndex: 'visible',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <Switch
                            checked={data}
                            onChange={(checked)=>{
                                elem.visible = checked;
                                this.updateGroups();
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
        const { dataSource } = this.state;
        dataSource.map((elem)=>{
            delete elem.vehicleTypeName;
        })
        await fetchAPI('PUT', 'tire_station_price_groups', undefined, dataSource);
        await this.fetchData();
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
                title={ <FormattedMessage id='navigation.tire_price_groups' /> }
                controls={
                    <div>
                        <Button
                            type="primary"
                            onClick={this.importDefault}
                        >
                            <FormattedMessage id="import_default"/>
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