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
        }
        this.columns = [
            {
                title:  'CODE',
                key:       'laborCode',
                width:     '10%',
                render: (data)=>(`${data.laborId}-${data.productId}`)
            },
            {
                title:  'ID',
                dataIndex: 'laborId',
                key:       'laborId',
                width:     '5%',
            },
            {
                title:  'DETAIL',
                dataIndex: 'productId',
                key:       'productId',
                width:     '10%',
            },
            {
                title:  'NAME',
                dataIndex: 'name',
                key:       'name',
                width:     '30%',
            },
            {
                title:  'OWN NAME',
                key:       'ownName',
                width:     '30%',
                render: (data)=>(
                    <Input/>
                )
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
                                console.log(this.state.labors[key])
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
                render: (data, elem)=>(
                    <InputNumber
                        defaultValue={data || 0}
                        disabled={elem.fixed}
                    />
                )
            },
            {
                title:  'PRICE',
                dataIndex: 'price',
                key:       'price',
                width:     '10%',
                render: (data, elem)=>(
                    <InputNumber
                        defaultValue={data || 0}
                        disabled={!elem.fixed}
                    />
                )
            }
        ]
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
            data.labors.map((elem, index)=>elem.key=index)
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
        const {labors} = this.state;
        const columns = this.columns;
        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.labors_page' />
                }
                controls={
                    <>
                    <Icon
                        type='save'
                        style={ {
                            fontSize: 24,
                            cursor:   'pointer',
                            margin:   '0 10px',
                        } }
                        onClick={ () =>
                            alert("In progress")
                        }
                    />
                    </>
                }
            >
                <Table
                    dataSource={labors}
                    columns={columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    pagination={false}
                    scroll={{ y: 680 }}
                />
            </Layout>
        );
    }
}
