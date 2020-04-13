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
    Switch
} from 'antd';
import { Layout, Spinner } from 'commons';

export default class LaborsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labors: [],
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
                dataIndex: 'laborId',
                key:       'laborId',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return data ? (
                        <p>{data}</p>
                    ) : (
                        <Input
                            onBlur={(event)=>{
                                console.log(data, elem);
                                this.state.labors[key].changed = true;
                                this.state.labors[key].laborId = event.target.value;
                                this.state.labors[key].laborCode = `${event.target.value}-${elem.productId}`;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
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
                    return data ? (
                        <p>{data}</p>
                    ) : (
                        <Input
                            onBlur={(event)=>{
                                this.state.labors[key].changed = true;
                                this.state.labors[key].productId = event.target.value;
                                this.state.labors[key].laborCode = `${elem.laborId}-${event.target.value}`;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
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

    saveLabors() {
        var labors = [];
        this.state.labors.map((elem)=>{
            if(elem.changed) {
                labors.push({
                    laborId: elem.laborId,
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
        });
        console.log(labors);
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/labors`;
        url += params;
        fetch(url, {
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
                elem.laborCode = `${elem.laborId}-${elem.productId}`;
            })
            that.setState({
                labors: data.labors,
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
            (labors[labors.length-1].defaultName != null || labors[labors.length-1].laborId != null)) {
            labors.push({
                key: labors.length,
                laborCode: null,
                laborId: null,
                defaultName: null,
                name: null,
                fixed: false,
                normHours: null,
                price: null,
            })
        }
        const columns = this.columns;
        var dataSource = [...labors];

        if(filterCode) dataSource = dataSource.filter((data, i) => data.laborCode.includes(filterCode));
        if(filterId) dataSource = dataSource.filter((data, i) => String(data.laborId).includes(filterId));
        if(filterDetail) dataSource = dataSource.filter((data, i) => String(data.productId).includes(filterDetail));
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
                    pagination={true}
                    scroll={{ y: 680 }}
                />
            </Layout>
        );
    }
}
