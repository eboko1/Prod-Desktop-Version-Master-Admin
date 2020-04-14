// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import {
    API_URL,
} from 'core/forms/orderDiagnosticForm/saga';
import {
    Table,
    Button,
    Icon,
    Checkbox,
    Select,
    Input,
    InputNumber,
    AutoComplete,
    Modal,
    Switch
} from 'antd';
import { Layout, Spinner } from 'commons';
const { Option } = Select;

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
        }
        this.columns = [
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>CODE</p>
                            <Input
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
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return !elem.new ? (
                        <p>{data}</p>
                    ) : (
                        <Select
                            style={{minWidth: "100px"}}
                            onChange={(value, option)=>{
                                this.state.labors[key].masterLaborId = value;
                                this.state.labors[key].defaultName = option.props.children;
                                this.state.labors[key].laborCode = `${value}-${elem.productId ? elem.productId : '0000000'}`;
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
                            <p>DETAIL</p>
                            <Input
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
                        <Select
                            style={{minWidth: "100px"}}
                            onChange={(value, option)=>{
                                this.state.labors[key].productId = value;
                                this.state.labors[key].laborCode = `${elem.masterLaborId ? elem.masterLaborId : "0000"}-${value}`;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.state.storeGroups.map((elem, index)=>(
                                <Option key={index} value={elem.id}>
                                    {elem.name}
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
                            <p>NAME</p>
                            <Input
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
                width:     '30%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>OWN NAME</p>
                            <Input
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
                width:     '30%',
                render: (elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            value={elem.name?elem.name:null}
                            onChange={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].name = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            },
            {
                title:  'FIXED',
                dataIndex: 'fixed',
                key:       'fixed',
                width:     '5%',
                render: (fixed, elem)=>{
                    const key = elem.key;
                    return (
                        <Switch
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
                title:  'HOURS',
                dataIndex: 'normHours',
                key:       'normHours',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 0}
                            disabled={elem.fixed}
                            onChange={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].normHours = event;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            },
            {
                title:  'PRICE',
                dataIndex: 'price',
                key:       'price',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 0}
                            disabled={!elem.fixed}
                            onChange={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].price = event;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            }
        ]
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
                    labors[labors.length-1].normHours = elem.normHours;
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
                    newLabors[newLabors.length-1].normHours = elem.normHours;
                }
            }
        });
        console.log(labors, newLabors);
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
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
            console.log(data);
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
            console.log(data);
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    fetchLabors() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
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
            console.log(data);
            data.labors.map((elem, index)=>{
                elem.key = index;
                elem.laborCode = `${elem.masterLaborId}-${elem.productId}`;
            })
            that.setState({
                labors: data.labors,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/labors/master?keepFlat=true`;
        url = API_URL + params;
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
            console.log(data.masterLabors);
            that.setState({
                masterLabors: data.masterLabors,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/store_groups?keepFlat=true`;
        url = API_URL + params;
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
            console.log(data);
            that.setState({
                storeGroups: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.fetchLabors();
    }

    render() {
        const { labors, filterCode, filterId, filterDetail, filterDefaultName, filterName } = this.state;
        if(labors.length && 
            (labors[labors.length-1].defaultName != "" || labors[labors.length-1].masterLaborId != "")) {
            labors.push({
                key: labors.length,
                laborCode: "",
                masterLaborId: "",
                productId: "",
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
        if(filterDefaultName) dataSource = dataSource.filter((data, i) => data.defaultName.includes(filterDefaultName));
        if(filterName) dataSource = dataSource.filter((data, i) => data.name.includes(filterName));

        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.labors_page' />
                }
                controls={
                    <Button
                        type='primary'
                        onClick={ () =>
                            this.saveLabors()
                        }
                    >
                        <FormattedMessage id='save' /> 
                    </Button>
                }
            >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                />
            </Layout>
        );
    }
}
