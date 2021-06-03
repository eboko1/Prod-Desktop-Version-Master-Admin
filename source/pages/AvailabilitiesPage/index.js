// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
    Table,
    Button,
    Icon,
    Select,
    Input,
    InputNumber,
    Modal,
    Popconfirm
} from 'antd';

// proj
import { Layout, Spinner } from 'commons';

// own
import Styles from './styles.m.css';
const { Option } = Select;

@injectIntl
@withRouter
class AvailabilitiesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            availOptions: [],
            supplierOptions: [],
        };
        this.supplierOptions = [];
        this.availOptions = [];
        this.columns = [
            {
                title:     <FormattedMessage id='availabilities-page.supplier'/>,
                dataIndex: 'businessSupplierId',
                key:       'businessSupplierId',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'availabilities-page.supplier'})}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value)=>{
                                elem.businessSupplierId = value;
                                this.addOrEditAvail(elem.key);
                            }}
                        >
                            {this.state.supplierOptions}
                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='availabilities-page.discount'/>,
                dataIndex: 'discount',
                key:       'discount',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={!(elem.businessSupplierId)}
                            defaultValue={0}
                            step={5}
                            max={100}
                            min={0}
                            value={Math.round(data*1000)/10 || 0}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={(value)=>{
                                elem.discount = value/100;
                                this.addOrEditAvail(elem.key);
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='availabilities-page.avail_0'/>,
                dataIndex: 'availableIn0LocationId',
                key:       'availableIn0LocationId',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            disabled={!(elem.businessSupplierId)}
                            placeholder={this.props.intl.formatMessage({id: 'availabilities-page.avail_0'})}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value)=>{
                                elem.availableIn0LocationId = value;
                                this.addOrEditAvail(elem.key);
                            }}
                        >
                           {this.state.availOptions}
                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='availabilities-page.avail_1'/>,
                dataIndex: 'availableIn1LocationId',
                key:       'availableIn1LocationId',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            disabled={!(elem.businessSupplierId)}
                            placeholder={this.props.intl.formatMessage({id: 'availabilities-page.avail_1'})}
                            value={data}
                            onChange={(value)=>{
                                elem.availableIn1LocationId = value;
                                this.addOrEditAvail(elem.key);
                            }}
                        >
                            {this.state.availOptions}
                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='availabilities-page.avail_2'/>,
                dataIndex: 'availableIn2LocationId',
                key:       'availableIn2LocationId',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            disabled={!(elem.businessSupplierId)}
                            placeholder={this.props.intl.formatMessage({id: 'availabilities-page.avail_2'})}
                            value={data}
                            onChange={(value)=>{
                                elem.availableIn2LocationId = value;
                                this.addOrEditAvail(elem.key);
                            }}
                        >
                            {this.state.availOptions}
                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='availabilities-page.avail_x'/>,
                dataIndex: 'availableInxLocationId',
                key:       'availableInxLocationId',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            disabled={!(elem.businessSupplierId)}
                            placeholder={this.props.intl.formatMessage({id: 'availabilities-page.avail_x'})}
                            value={data}
                            onChange={(value)=>{
                                elem.availableInxLocationId = value;
                                this.addOrEditAvail(elem.key);
                            }}
                        >
                            {this.state.availOptions}
                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='availabilities-page.limit'/>,
                dataIndex: 'limit',
                key:       'limit',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={!(elem.businessSupplierId)}
                            defaultValue={0}
                            value={data || 0}
                            onChange={(value)=>{
                                elem.limit = value;
                                this.addOrEditAvail(elem.key);
                            }}
                        />
                    )
                }
            },
            {
                width: "3%",
                key: "delete",
                render: (elem) => {
                    return (
                        <Popconfirm
                            disabled={elem.id == undefined}
                            title={
                                <FormattedMessage id="add_order_form.delete_confirm" />
                            }
                            onConfirm={async ()=>{
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = __API_URL__;
                                let params = `/availabilities/settings?id=${elem.id}`;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if(result.success) {
                                        this.updateDataSource();
                                    }
                                    else {
                                        console.log("BAD", result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            }}
                        >
                            <Icon type="delete" className={elem.id == undefined ? Styles.disabledIcon : Styles.deleteIcon} />
                        </Popconfirm>
                    );
                },
            },
        ]
    }

    addOrEditAvail(index) {
        const { dataSource } = this.state;
        const targetElem = dataSource[index];
        var data = {}, 
            type = 'POST';
        if(targetElem.id == undefined) {
            data = {
                businessSupplierId: targetElem.businessSupplierId,
                discount: targetElem.discount,
                availableIn0LocationId: targetElem.availableIn0LocationId,
                availableIn1LocationId: targetElem.availableIn1LocationId,
                availableIn2LocationId: targetElem.availableIn2LocationId,
                availableInxLocationId: targetElem.availableInxLocationId,
                limit: targetElem.limit,
            }
        }
        else {
            data = {
                id: targetElem.id,
                businessSupplierId: targetElem.businessSupplierId,
                discount: targetElem.discount,
                availableIn0LocationId: targetElem.availableIn0LocationId,
                availableIn1LocationId: targetElem.availableIn1LocationId,
                availableIn2LocationId: targetElem.availableIn2LocationId,
                availableInxLocationId: targetElem.availableInxLocationId,
                limit: targetElem.limit,
            }
            type = 'PUT';
        }
        
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/availabilities/settings`;
        url += params;

        fetch(url, {
            method: type,
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(data)
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
            that.updateDataSource();
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    updateDataSource() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/availabilities/settings`;
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
            data.map((elem, index)=>elem.key=index);
            that.setState({
                dataSource: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    componentDidMount() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/availabilities/locations`;
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
            const availOptions = data.map((elem, i)=>
                    <Option key={i} value={elem.id}>
                        {`${elem.code} (${elem.name})`}
                    </Option>);
            that.setState({availOptions});
        })
        .catch(function (error) {
            console.log('error', error)
        })

        params = `/business_suppliers?all=true`;
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
            const supplierOptions = data.map((elem, i)=>
                    <Option key={i} value={elem.id}>
                        {elem.name}
                    </Option>);
            that.setState({supplierOptions});
        })
        .catch(function (error) {
            console.log('error', error)
        })

        this.updateDataSource();
    }

    render() {
        const {dataSource} = this.state;
        if(!dataSource.length || dataSource[dataSource.length-1].id != undefined) {
            dataSource.push({
                key: dataSource.length,
                id: undefined,
            })
        }

        return (
            <Layout
                title={ <FormattedMessage id='navigation.availabilities' /> }
                controls={
                    <>
                        
                    </>
                }
            >
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    scroll={{ y: 680 }}
                />
            </Layout>
        );
    }
}

export default AvailabilitiesPage;