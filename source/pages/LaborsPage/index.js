// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    Table,
    Button,
    Icon,
    Checkbox,
    Select,
    Input,
    InputNumber,
    notification,
    message,
    Switch,
    TreeSelect,
    Pagination,
} from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { permissions, isForbidden } from 'utils';
const { Option } = Select;

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@injectIntl
@connect(
    mapStateToProps,
    void 0,
)
export default class LaborsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labors: [],
            masterLabors: [],
            storeGroups: [],
            filterCode: null,
            filterId: null,
            filterDetail: null,
            filterDefaultName: null,
            filterName: null,
            currentPage: 1,
        }
        this.treeData = [];
        this.columns = [
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.labors_code" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.labors_code'})}
                                value={this.state.filterCode}
                                onChange={(event)=>{
                                    this.setState({
                                        filterCode: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'laborCode',
                dataIndex: 'laborCode',
                width:     '10%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>ID</p>
                            <Input
                                allowClear
                                placeholder="ID"
                                value={this.state.filterId}
                                onChange={(event)=>{
                                    this.setState({
                                        filterId: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'masterLaborId',
                key:       'masterLaborId',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return !elem.new ? (
                        <p>{data}</p>
                    ) : (
                        <Select
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            showSearch
                            placeholder="ID"
                            style={{minWidth: "100px"}}
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(option.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            value={this.state.labors[key].masterLaborId ? this.state.labors[key].masterLaborId : undefined}
                            onChange={(value, option)=>{
                                this.state.labors[key].masterLaborId = value;
                                this.state.labors[key].defaultName = option.props.children;
                                this.state.labors[key].laborCode = `${value}-${elem.productId ? elem.productId : '0000000'}`;
                                this.state.labors[key].name = option.props.children + " " + this.state.labors[key].detailTitle;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.state.masterLabors.map((elem, index)=>(
                                <Option key={index} value={elem.masterLaborId}>
                                    {elem.defaultMasterLaborName}
                                </Option>
                            ))}
                        </Select>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.detail_code" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                                value={this.state.filterDetail}
                                onChange={(event)=>{
                                    this.setState({
                                        filterDetail: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'productId',
                key:       'productId',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return !elem.new ? (
                        <p>{data}</p>
                    ) : (
                        <TreeSelect
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            showSearch
                            style={{ minWidth: '130px', maxWidth: '10%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.treeData}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                            value={this.state.labors[key].productId ? this.state.labors[key].productId : undefined}
                            filterTreeNode={(input, node) => (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={(value, option)=>{
                                this.state.labors[key].productId = value;
                                this.state.labors[key].laborCode = `${elem.masterLaborId ? elem.masterLaborId : "0000"}-${value}`;
                                this.state.labors[key].detailTitle = option.props.title;
                                this.state.labors[key].name = this.state.labors[key].defaultName + " " + option.props.title;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.service_type" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.service_type'})}
                                value={this.state.filterDefaultName}
                                onChange={(event)=>{
                                    this.setState({
                                        filterDefaultName: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'defaultName',
                key:       'defaultName',
                width:     '20%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.detail_name" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                                value={this.state.filterName}
                                onChange={(event)=>{
                                    this.setState({
                                        filterName: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'name',
                width:     '25%',
                render: (elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            ref={(input) => { this.nameInput = input; }} 
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            value={elem.name?elem.name:null}
                            onChange={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].name = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.fixed" />,
                dataIndex: 'fixed',
                key:       'fixed',
                width:     '5%',
                render: (fixed, elem)=>{
                    const key = elem.key;
                    return (
                        <Switch
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            checked={fixed}
                            onClick={(event)=>{
                                this.state.labors[key].changed = true; 
                                this.state.labors[key].fixed = event;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="hours" />,
                dataIndex: 'normHours',
                key:       'normHours',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            min={0.1}
                            step={0.2}
                            value={data || 1}
                            disabled={elem.fixed || isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            onChange={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].normHours = event;
                                this.setState({
                                    update: true,
                                });
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                dataIndex: 'price',
                key:       'price',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            min={1}
                            value={data || 1}
                            disabled={!elem.fixed || isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            onChange={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].price = event;
                                this.setState({
                                    update: true,
                                });
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            }
        ]
    }

    async updatePrice () {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/labors/recalc_prices`;
        url += params;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            message.success('Цена обновлена');
        })
        .catch(function (error) {
            message.error('Цена не задана!');
        });

        await this.fetchLabors();
    }

    async saveLabors() {
        var labors = [], newLabors = [];
        this.state.labors.map((elem)=>{
            if(elem.changed && !elem.new) {
                labors.push({
                    masterLaborId: elem.masterLaborId,
                    productId: elem.productId,
                });
                if(elem.laborId) labors[labors.length-1].laborId = elem.laborId;
                if(elem.name) labors[labors.length-1].name = elem.name;
                if(elem.fixed) {
                    labors[labors.length-1].fixed = true;
                    labors[labors.length-1].price = elem.price;
                }
                else {
                    labors[labors.length-1].fixed = false;
                    labors[labors.length-1].normHours = elem.normHours ? elem.normHours : 1;
                }
            }
            if(elem.new && elem.masterLaborId && elem.productId) {
                newLabors.push({
                    masterLaborId: elem.masterLaborId,
                    productId: elem.productId,
                });
                if(elem.name) newLabors[newLabors.length-1].name = elem.name;
                if(elem.fixed) {
                    newLabors[newLabors.length-1].fixed = true;
                    newLabors[newLabors.length-1].price = elem.price;
                }
                else {
                    newLabors[newLabors.length-1].fixed = false;
                    newLabors[newLabors.length-1].normHours = elem.normHours ? elem.normHours : 1;
                }
            }
        });
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/labors`;
        url += params;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(newLabors),
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            //console.log(data);
        })
        .catch(function (error) {
            console.log('error', error)
        });

        await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(labors),
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    fetchLabors() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/labors`;
        url += params;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            data.labors.sort((a, b) => a.masterLaborId < b.masterLaborId ? -1 : (a.masterLaborId > b.masterLaborId ? 1 : 0));
            data.labors.map((elem, index)=>{
                elem.key = index;
                elem.laborCode = `${elem.masterLaborId}-${elem.productId}`;
            })
            that.setState({
                labors: data.labors,
                currentPage: that.props.location.state && that.props.location.state.showForm ? Math.ceil(data.labors.length / 10) : 1,
            });
            if(that.props.location.state && that.props.location.state.showForm) that.nameInput.focus();
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/labors/master`;
        url = __API_URL__ + params;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            that.setState({
                masterLabors: data.masterLabors,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/store_groups`;
        url = __API_URL__ + params;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            that.setState({
                storeGroups: data,
            });
            that.buildStoreGroupsTree();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for(let i = 0; i < this.state.storeGroups.length; i++) {
            const parentGroup = this.state.storeGroups[i];
            treeData.push({
                title: `${parentGroup.name} (#${parentGroup.id})`,
                value: parentGroup.id,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: `${childGroup.name} (#${childGroup.id})`,
                    value: childGroup.id,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: `${lastNode.name} (#${lastNode.id})`,
                        value: lastNode.id,
                        key: `${i}-${j}-${k}`,
                        children: [],
                    })
                    for(let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[l];
                        treeData[i].children[j].children[k].children.push({
                            title: `${elem.name} (#${elem.id})`,
                            value: elem.id,
                            key: `${i}-${j}-${k}-${l}`,
                        })
                    }
                }
            }
        }
        this.treeData = treeData;
    }

    componentDidMount() {
        this.fetchLabors();
    }

    render() {
        const { labors, filterCode, filterId, filterDetail, filterDefaultName, filterName, currentPage } = this.state;
        if(
            !isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD) && 
            labors.length && 
            (labors[labors.length-1].defaultName != "" || labors[labors.length-1].masterLaborId != "")
        ) {
            labors.push({
                key: labors.length,
                laborCode: "0000-0000000",
                masterLaborId: "",
                productId: "",
                detailTitle: "",
                defaultName: "",
                name: "",
                fixed: false,
                normHours: 1,
                price: null,
                new: true,
            })
        }
        const columns = this.columns;
        var dataSource = [...labors];

        if(filterCode) dataSource = dataSource.filter((data, i) => data.laborCode.includes(filterCode));
        if(filterId) dataSource = dataSource.filter((data, i) => String(data.masterLaborId).includes(String(filterId)));
        if(filterDetail) dataSource = dataSource.filter((data, i) => String(data.productId).includes(String(filterDetail)));
        if(filterDefaultName) dataSource = dataSource.filter((data, i) => data.defaultName.toLowerCase().includes(filterDefaultName.toLowerCase()));
        if(filterName) dataSource = dataSource.filter((data, i) => data.name.toLowerCase().includes(filterName.toLowerCase()));

        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.labors_page' />
                }
                controls={
                    <>
                        <Button
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            style={{marginRight: 10}}
                            onClick={ () =>
                                this.updatePrice()
                            }
                        >
                            <FormattedMessage id='update_price' /> 
                        </Button>
                        <Button
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            type='primary'
                            onClick={ () =>
                                this.saveLabors()
                            }
                        >
                            <FormattedMessage id='save' /> 
                        </Button>
                    </>
                }
            >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    pagination={
                        {
                            pageSize: 10,
                            hideOnSinglePage: true,
                            current: currentPage,
                            onChange: page => {
                                this.setState({
                                    currentPage: page,
                                })
                            }
                        }
                    }
                />
            </Layout>
        );
    }
}
