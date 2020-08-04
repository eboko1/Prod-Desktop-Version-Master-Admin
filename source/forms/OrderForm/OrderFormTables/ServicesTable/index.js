// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, InputNumber, Icon, Popconfirm, Select, Input, Button, Modal, message } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden, images } from 'utils';
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { FavouriteServicesModal, AddServiceModal, LaborsNormHourModal } from 'modals'

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
class ServicesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceModalVisible: false,
            serviceModalKey: 0,
            dataSource: [],
        }

        this.laborTimeMultiplier = this.props.laborTimeMultiplier || 1;
        this.updateLabor = this.updateLabor.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);

        this.columns = [
            {
                title:  ()=>{
                            return(
                                <InputNumber
                                    title='Коэффициент норматива'
                                    style={{fontWeight: 700}}
                                    defaultValue={ this.props.laborTimeMultiplier || 1}
                                    step={0.1}
                                    min={0}
                                    formatter={value => `${Math.round(value*100)}%`}
                                    parser={value => Math.round(value.replace('%', '')/100)}
                                    onChange={(value)=>this.updateTimeMultiplier(value)}
                                    title={this.props.intl.formatMessage({id: "labors_table.mark_up"})}
                                />
                            )
                        },
                width: "8%",
                key: "buttonGroup",
                dataIndex: "key",
                render: (data, elem) => {
                    const confirmed = elem.agreement.toLowerCase();
                    return (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <Button
                                type='primary'
                                disabled={confirmed != "undefined" || this.props.disabled}
                                onClick={()=>{
                                    this.showServiceProductModal(data)
                                }}
                                title={this.props.intl.formatMessage({id: "labors_table.add_edit_button"})}
                            >
                                <div
                                    style={{
                                        width: 18,
                                        height: 18,
                                        backgroundColor: confirmed != "undefined" || this.props.disabled ? 'black' : 'white',
                                        mask: `url(${images.wrenchIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.wrenchIcon}) no-repeat center / contain`,
                                        transform: "scale(-1, 1)",
                                    }}
                                ></div>
                            </Button>
                            {!(elem.laborId) ? 
                                <FavouriteServicesModal
                                    laborTimeMultiplier={this.laborTimeMultiplier}
                                    disabled={this.props.disabled}
                                    normHourPrice={this.props.normHourPrice}
                                    defaultEmployeeId={this.props.defaultEmployeeId}
                                    tecdocId={this.props.tecdocId}
                                    orderId={this.props.orderId}
                                    updateDataSource={this.updateDataSource}
                                    employees={this.props.employees}
                                    user={this.props.user}
                                />
                            :
                                <QuickEditModal
                                    laborTimeMultiplier={this.laborTimeMultiplier}
                                    disabled={!(elem.laborId) || this.props.disabled}
                                    confirmed={confirmed != 'undefined'}
                                    labor={elem}
                                    onConfirm={this.updateLabor}
                                    tableKey={elem.key}
                                    employees={this.props.employees}
                                    user={this.props.user}
                                    tecdocId={this.props.tecdocId}
                                />
                            }
                        </div>
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.service_type" />,
                width: "15%",
                key: "defaultName",
                dataIndex: 'defaultName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.detail_name" />,
                width: "15%",
                key: "serviceName",
                dataIndex: 'serviceName',
                render: (data) => {
                        return (
                            data ? data : <FormattedMessage id="long_dash"/>
                        )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.master" />,
                width: "10%",
                key: "employeeId",
                dataIndex: 'employeeId',
                render: (data) => {
                    var employee = this.props.employees.find((elem)=>elem.id==data);
                    return (
                        data ? `${employee.name} ${employee.surname}` : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="services_table.norm_hours" />
                        </div>,
                className: Styles.numberColumn,
                width: "8%",
                key: "hours",
                dataIndex: 'hours',
                render: (data) => {
                    return (
                        <span>
                            {data ? 
                            <>{data} <FormattedMessage id="order_form_table.hours_short" /></> : 
                            <FormattedMessage id="long_dash"/>}
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.prime_cost" />
                        </div>,
                className: Styles.numberColumn,
                width: "8%",
                key: "purchasePrice",
                dataIndex: 'purchasePrice',
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                        <span е>
                            {data ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.price" />
                        </div>,
                className: Styles.numberColumn,
                width: "8%",
                key: "price",
                dataIndex: 'price',
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                        <span>
                            {data ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.count" />
                        </div>,
                className: Styles.numberColumn,
                width: "5%",
                key: "count",
                dataIndex: 'count',
                render: (data) => {
                    return (
                        <span>
                            {data ? data : 0} <FormattedMessage id="order_form_table.hours_short" />
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.sum" />
                        </div>,
                className: Styles.numberColumn,
                width: "8%",
                key: "sum",
                dataIndex: 'sum',
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                        <span>
                            {data ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}
                        </span> 
                    )
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.status' />,
                width: "10%",
                key: 'agreement',
                dataIndex: 'agreement',
                render: (data, elem) => {
                    const key = elem.key;
                    const confirmed = data.toLowerCase();
                    let color;
                    switch(confirmed) {
                        case "rejected":
                            color = 'rgb(255, 126, 126)';
                            break;
                        case "agreed":
                            color = 'rgb(81, 205, 102)';
                            break;
                        default:
                            color = null;
                    }
                    return (
                        <Select
                            disabled={isForbidden(
                                this.props.user,
                                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
                            )}
                            style={{color: color}}
                            value={confirmed}
                            onChange={(value)=>{
                                elem.agreement = value.toUpperCase();
                                this.updateLabor(key, elem);
                            }}
                        >
                            <Option key={0} value={'undefined'}>
                                <FormattedMessage id='status.undefined'/>
                            </Option>
                            <Option key={1} value={'agreed'} style={{color: 'rgb(81, 205, 102)'}}>
                                <FormattedMessage id='status.agreed'/>
                            </Option>
                            <Option key={2} value={'rejected'} style={{color: 'rgb(255, 126, 126)'}}>
                                <FormattedMessage id='status.rejected'/>
                            </Option>
                        </Select>
                    )
                },
            },
            {
                width: "2%",
                key: "favourite",
                render: (elem)=>{
                    return(
                        <Popconfirm
                            title={
                                elem.frequentLaborId ?
                                    <FormattedMessage id="add_order_form.favourite_remove" />
                                :
                                    <FormattedMessage id="add_order_form.favourite_confirm" />
                            }
                            onConfirm={async ()=>{
                                var data = [{
                                    laborId: elem.laborId,
                                    name: elem.serviceName,
                                    hours: elem.hours ? elem.hours : 1,
                                    purchasePrice: elem.purchasePrice ? elem.purchasePrice : 0,
                                    count: elem.count ? elem.count : 1,
                                }];
                                var that = this;
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = API_URL;
                                let params = `/orders/frequent/labors`;
                                if(elem.frequentLaborId) params += `?ids=[${elem.frequentLaborId}]`;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method: elem.frequentLaborId ? 'DELETE' : 'POST',
                                        headers: {
                                            'Authorization': token,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                                    });
                                    const result = await response.json();
                                    if(result.success) {
                                        that.updateDataSource();
                                    }
                                    else {
                                        console.log("BAD", result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            }}
                        >
                            <Icon
                                type="star"
                                theme={elem.frequentLaborId ? 'filled' : ''}
                                style={{color: 'gold', fontSize: 18}}
                                title={this.props.intl.formatMessage({id: elem.frequentLaborId ? "delete_from_favorites" : "add_to_favorites"})}
                            />
                        </Popconfirm>
                    )
                }
            },
            {
                width: "3%",
                key: "delete",
                render: (elem) => {
                    const confirmed = elem.agreement.toLowerCase();
                    const disabled = confirmed != "undefined" || this.props.disabled;
                    return (
                        <Popconfirm
                            disabled={disabled}
                            title={
                                <FormattedMessage id="add_order_form.delete_confirm" />
                            }
                            onConfirm={async ()=>{
                                var that = this;
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = API_URL;
                                let params = `/orders/${this.props.orderId}/labors?ids=[${elem.id}] `;
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
                                        that.updateDataSource();
                                    }
                                    else {
                                        console.log("BAD", result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            }}
                        >
                            <Icon type="delete" className={disabled ? Styles.disabledIcon : Styles.deleteIcon} />
                        </Popconfirm>
                    );
                },
            },
        ]
    }

    async updateTimeMultiplier(multiplier) {
        this.laborTimeMultiplier = multiplier;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({laborTimeMultiplier: multiplier}),
            });
            const result = await response.json();
            if(result.success) {
                console.log("OK", result);
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    async updateDuration() {
        let hours = 0;
        this.state.dataSource.map((elem)=>{
            hours += elem.count;
        })
        hours = Math.round(hours*10)/10;
        
        if(hours > 8) {
            message.warning('Количество часов превышает 8. ');
            hours = 8;
        }

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({duration: hours}),
            });
            const result = await response.json();
            if(result.success) {
                window.location.reload();
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    showServiceProductModal(key) {
        this.setState({
            serviceModalVisible: true,
            serviceModalKey: key,
        })
    }
    hideServicelProductModal() {
        this.setState({
            serviceModalVisible: false,
        })
    }

    updateDataSource() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}/labors`;
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
            data.labors.map((elem, index)=>{
                elem.key = index;
            })
            that.setState({
                dataSource: data.labors,
            })
            that.props.reloadOrderForm();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    async updateLabor(key, labor) {
        this.state.dataSource[key] = labor;
        const data = {
            updateMode: true,
            services: [
                {
                    id: labor.id,
                    serviceId: labor.laborId,
                    serviceName: labor.serviceName,
                    employeeId: labor.employeeId,
                    serviceHours: labor.hours ? labor.hours : 0,
                    purchasePrice: labor.purchasePrice ? Math.round(labor.purchasePrice*10)/10 : 0,
                    count: labor.count ? labor.count : 1,
                    servicePrice: labor.price ? Math.round(labor.price*10)/10 : 1,
                    comment: labor.comment || {
                        comment: undefined,
                        positions: [],
                    },
                }
            ]
        }
        if(!isForbidden(this.props.user, permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,)) {
            data.services[0].agreement = labor.agreement;
        }

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if(result.success) {
                this.props.reloadOrderForm();
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }

        await this.updateDataSource();
    }

    componentDidMount() {
        let tmp = [...this.props.orderServices];
        tmp.map((elem,i)=>elem.key=i);
        this.setState({
            dataSource: tmp,
        })
    }

    render() {
        if(this.state.dataSource.length == 0  || this.state.dataSource[this.state.dataSource.length-1].serviceName != undefined) {
            this.state.dataSource.push({
                key: this.state.dataSource.length,
                id: undefined,
                laborId: undefined,
                serviceName: undefined,
                comment: {
                    comment: undefined,
                    positions: [],
                },
                count: 0,
                price: 0,
                purchasePrice: 0,
                sum: 0,
                agreement: "UNDEFINED",
            })
        }
        
        return (
            <Catcher>
                <Table
                    className={ Styles.serviceTable }
                    dataSource={ this.state.dataSource }
                    columns={ this.columns }
                    pagination={false}
                />
                <AddServiceModal
                    laborTimeMultiplier={this.laborTimeMultiplier}
                    defaultEmployeeId={this.props.defaultEmployeeId}
                    normHourPrice={this.props.normHourPrice}
                    user={this.props.user}
                    employees={this.props.employees}
                    visible={this.state.serviceModalVisible}
                    updateLabor={this.updateLabor}
                    updateDataSource={this.updateDataSource}
                    tableKey={this.state.serviceModalKey}
                    labor={this.state.dataSource[this.state.serviceModalKey]}
                    hideModal={()=>this.hideServicelProductModal()}
                    orderId={this.props.orderId}
                    tecdocId={this.props.tecdocId}
                />
            </Catcher>
        );
    }
}

export default ServicesTable;

@injectIntl
class QuickEditModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible: false,
        }
        this.columns = [
            {
                title: <FormattedMessage id="order_form_table.service_type" />,
                width: "15%",
                key: "defaultName",
                dataIndex: 'defaultName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.detail_name" />,
                width: "15%",
                key: "serviceName",
                dataIndex: 'serviceName',
                render: (data) => {
                        return (
                            <Input
                                value={data}
                                disabled={this.props.confirmed}
                                onChange={(event)=>{
                                    this.state.dataSource[0].serviceName = event.target.value;
                                    this.setState({
                                        update: true
                                    })
                                }}
                            />
                        )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.master" />,
                width: "10%",
                key: "employeeId",
                dataIndex: 'employeeId',
                render: (data) => {
                    return (
                        <Select
                            value={data ? data : undefined}
                            allowClear
                            showSearch
                            style={{minWidth: 220}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220}}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.master'})}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.dataSource[0].employeeId = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.props.employees.map((elem, i)=>(
                                <Option key={i} value={elem.id}>
                                    {elem.name} {elem.surname}
                                </Option>
                            ))}
                        </Select>
                    )
                },
            },
            {
                title:  <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            value={Math.round(data*10)/10 || 0}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[0].purchasePrice = value;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            value={Math.round(data*10)/10 || 1}
                            min={0}
                            disabled={this.props.confirmed}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[0].price = value;
                                this.state.dataSource[0].sum = value * this.state.dataSource[0].count;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.count" />,
                key:       'count',
                dataIndex: 'count',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            value={data ? data : 0}
                            min={0}
                            disabled={this.props.confirmed}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[0].count = value;
                                this.state.dataSource[0].sum = value * this.state.dataSource[0].price;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.norm_hours" />,
                key:       'hours',
                dataIndex: 'hours',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <LaborsNormHourModal
                            user={this.props.user}
                            tecdocId={this.props.tecdocId}
                            storeGroupId={elem.storeGroupId}
                            onSelect={(hours)=>{
                                this.state.dataSource[0].hours = hours;
                                this.state.dataSource[0].count = hours * this.props.laborTimeMultiplier;
                                this.setState({
                                    update: true
                                })
                            }}
                            hours={data}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.sum" />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            disabled
                            style={{color: 'black'}}
                            value={Math.round(data*10)/10 || 1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    )
                }
            },
        ]
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.onConfirm(this.props.tableKey, this.state.dataSource[0]);
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    render() {
        return(
            <>
                <Button
                    type='primary'
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                            dataSource: [this.props.labor]
                        })
                    }}
                    title={this.props.intl.formatMessage({id: "quick_edit"})}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            backgroundColor: this.props.disabled ? 'black' : 'white',
                            mask: `url(${images.pencilIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.pencilIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width='80%'
                    visible={this.state.visible}
                    title={<FormattedMessage id='order_form_table.quick_edit'/>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                        <Table
                            columns={this.columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                        />
                </Modal>
            </>
        )
    }
}