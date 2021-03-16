// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    Table,
    InputNumber,
    Icon,
    Popconfirm,
    Select,
    Input,
    Button,
    Modal,
    message,
} from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden, images } from 'utils';
import {
    FavouriteServicesModal,
    AddServiceModal,
    LaborsNormHourModal,
    ComplexesModal,
} from 'modals';
import { Barcode } from "components";

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const INACTIVE = 'INACTIVE',
      IN_PROGRESS = 'IN_PROGRESS',
      STOPPED = 'STOPPED',
      DONE = 'DONE',
      CANCELED = 'CANCELED';

@injectIntl
class ServicesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceModalVisible: false,
            serviceModalKey:     0,
            dataSource:          [],
        };
        this.updateLabor = this.updateLabor.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);
        this.masterLabors = [];
        this.laborsTreeData = [];

        this.columns = [
            {
                title: ()=>(
                            <div className={Styles.headerActions}>
                                <Barcode
                                    button
                                    prefix={'LBS'}
                                    onConfirm={(code, pref, fullCode)=>{
                                        const { dataSource } = this.state;
                                        const lastService = dataSource[dataSource.length - 1];
                                        lastService.barcode = fullCode;
                                        this.showServiceProductModal(lastService.key)
                                    }}
                                />
                                {!isForbidden(this.props.user, permissions.ACCESS_ORDER_LABORS_COMPLEXES) &&
                                    <ComplexesModal
                                        normHourPrice={ this.props.normHourPrice }
                                        disabled={this.props.disabled}
                                        tecdocId={this.props.tecdocId}
                                        labors={this.props.labors}
                                        details={this.props.details}
                                        detailsTreeData={this.props.detailsTreeData}
                                        orderId={this.props.orderId}
                                        reloadOrderForm={this.props.reloadOrderForm}
                                        laborTimeMultiplier={this.props.laborTimeMultiplier}
                                    />
                                }
                            </div>
                            
                        ),
                key:       'buttonGroup',
                dataIndex: 'key',
                render:    (data, elem) => {
                    const confirmed = elem.agreement.toLowerCase(),
                          backgroundColor = confirmed != 'undefined' || this.props.disabled ? 'black' : 'white';
                    const stageDisabled = elem.stage != INACTIVE;

                    return (
                        <div
                            style={ {
                                display:        'flex',
                                justifyContent: 'space-evenly',
                            } }
                        >
                            <Button
                                type='primary'
                                disabled={
                                    confirmed != 'undefined' ||
                                    this.props.disabled
                                }
                                onClick={ () => {
                                    this.showServiceProductModal(data);
                                } }
                                title={ this.props.intl.formatMessage({
                                    id: 'labors_table.add_edit_button',
                                }) }
                            >
                                <div
                                    style={ {
                                        width:           18,
                                        height:          18,
                                        backgroundColor: backgroundColor,
                                        mask:       `url(${images.wrenchIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.wrenchIcon}) no-repeat center / contain`,
                                        transform:  'scale(-1, 1)',
                                    } }
                                ></div>
                            </Button>
                            { !elem.laborId ? (
                                <FavouriteServicesModal
                                    laborTimeMultiplier={this.props.laborTimeMultiplier}
                                    disabled={ this.props.disabled }
                                    normHourPrice={ this.props.normHourPrice }
                                    defaultEmployeeId={
                                        this.props.defaultEmployeeId
                                    }
                                    tecdocId={ this.props.tecdocId }
                                    orderId={ this.props.orderId }
                                    updateDataSource={ this.updateDataSource }
                                    employees={ this.props.employees }
                                    user={ this.props.user }
                                    laborsTreeData={ this.laborsTreeData }
                                    labors={ this.props.labors }
                                    details={ this.props.details }
                                />
                            ) : (
                                <QuickEditModal
                                    laborTimeMultiplier={this.props.laborTimeMultiplier}
                                    disabled={
                                        !elem.laborId || this.props.disabled
                                    }
                                    confirmed={ confirmed != 'undefined' }
                                    labor={ elem }
                                    onConfirm={ this.updateLabor }
                                    tableKey={ elem.key }
                                    employees={ this.props.employees }
                                    user={ this.props.user }
                                    tecdocId={ this.props.tecdocId }
                                    stageDisabled={stageDisabled}
                                />
                            ) }
                        </div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.service_type' />,
                key:       'defaultName',
                dataIndex: 'defaultName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'serviceName',
                dataIndex: 'serviceName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.master' />,
                key:       'employeeId',
                dataIndex: 'employeeId',
                render:    data => {
                    var employee = this.props.employees.find(
                        elem => elem.id == data,
                    );

                    return employee ? 
                        `${employee.name} ${employee.surname}`
                        : (
                            <FormattedMessage id='long_dash' />
                        );
                },
            },
            {
                title:  <div className={ Styles.numberColumn }>
                            <FormattedMessage id='services_table.norm_hours' />
                            
                        </div>,
                className: Styles.numberColumn,
                key:       'hours',
                dataIndex: 'hours',
                render:    data => {
                    let strVal = Number(data).toFixed(1);

                    return data ? 
                    (
                        <span>
                            { strVal }{ ' ' }
                            <FormattedMessage id='order_form_table.hours_short' />
                        </span>
                    ) : (
                        <FormattedMessage id='long_dash' />
                    );
                },
            },
            {
                title:  <div className={ Styles.numberColumn }>
                            <FormattedMessage id='order_form_table.prime_cost' />
                        </div>,
                className: Styles.numberColumn,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                render:    data => {
                    let strVal = Number(data).toFixed(2);

                    return (
                        <span>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </span>
                    );
                },
            },
            {
                title:  <div className={ Styles.numberColumn }>   
                            <FormattedMessage id='order_form_table.price' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                className: Styles.numberColumn,
                key:       'price',
                dataIndex: 'price',
                render:    data => {
                    let strVal = Number(data).toFixed(2);

                    return (
                        <span>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </span>
                    );
                },
            },
            {
                title:  <div className={ Styles.numberColumn }>
                            <FormattedMessage id='order_form_table.count' />
                        </div>,
                className: Styles.numberColumn,
                key:       'count',
                dataIndex: 'count',
                render:    data => {
                    let strVal = Number(data).toFixed(1);

                    return (
                        <span>
                            { data ? strVal : 0 }{ ' ' }
                            <FormattedMessage id='order_form_table.hours_short' />
                        </span>
                    );
                },
            },
            {
                title:  <div className={ Styles.numberColumn }>   
                            <FormattedMessage id='order_form_table.sum' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                className: Styles.numberColumn,
                key:       'sum',
                dataIndex: 'sum',
                render:    data => {
                    let strVal = Number(data).toFixed(2);

                    return (
                        <span>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </span>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.status' />,
                key:       'agreement',
                dataIndex: 'agreement',
                render:    (data, elem) => {
                    const key = elem.key;
                    const confirmed = data.toLowerCase();
                    let color;
                    switch (confirmed) {
                        case 'rejected':
                            color = 'rgb(255, 126, 126)';
                            break;
                        case 'agreed':
                            color = 'var(--green)';
                            break;
                        default:
                            color = null;
                    }

                    return (
                        <Select
                            disabled={ this.props.disabled || isForbidden(
                                this.props.user,
                                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
                            ) }
                            style={ { color: color } }
                            value={ confirmed }
                            onChange={ value => {
                                elem.agreement = value.toUpperCase();
                                //elem.stage = value == 'rejected' ? 'CANCELED' : 'INACTIVE';
                                this.updateLabor(key, elem);
                            } }
                        >
                            <Option key={ 0 } value={ 'undefined' }>
                                <FormattedMessage id='status.undefined' />
                            </Option>
                            <Option
                                key={ 1 }
                                value={ 'agreed' }
                                style={ { color: 'var(--green)' } }
                            >
                                <FormattedMessage id='status.agreed' />
                            </Option>
                            <Option
                                key={ 2 }
                                value={ 'rejected' }
                                style={ { color: 'rgb(255, 126, 126)' } }
                            >
                                <FormattedMessage id='status.rejected' />
                            </Option>
                        </Select>
                    );
                },
            },
            {
                key:    'favourite',
                render: elem => {
                    return (
                        <Popconfirm
                            title={
                                elem.frequentLaborId ? (
                                    <FormattedMessage id='add_order_form.favourite_remove' />
                                ) : (
                                    <FormattedMessage id='add_order_form.favourite_confirm' />
                                )
                            }
                            onConfirm={ async () => {
                                var data = [
                                    {
                                        laborId:       elem.laborId,
                                        name:          elem.serviceName,
                                        hours:         elem.hours ? elem.hours : 1,
                                        purchasePrice: elem.purchasePrice
                                            ? elem.purchasePrice
                                            : 0,
                                        count: elem.count ? elem.count : 1,
                                    },
                                ];
                                var that = this;
                                let token = localStorage.getItem(
                                    '_my.carbook.pro_token',
                                );
                                let url = __API_URL__;
                                let params = '/orders/frequent/labors';
                                if (elem.frequentLaborId) { params += `?ids=[${elem.frequentLaborId}]`; }
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method: elem.frequentLaborId
                                            ? 'DELETE'
                                            : 'POST',
                                        headers: {
                                            Authorization:  token,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                                    });
                                    const result = await response.json();
                                    if (result.success) {
                                        that.updateDataSource();
                                    } else {
                                        console.log('BAD', result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            } }
                        >
                            <Icon
                                type='star'
                                theme={ elem.frequentLaborId ? 'filled' : '' }
                                style={ { color: 'gold', fontSize: 18 } }
                                title={ this.props.intl.formatMessage({
                                    id: elem.frequentLaborId
                                        ? 'delete_from_favorites'
                                        : 'add_to_favorites',
                                }) }
                            />
                        </Popconfirm>
                    );
                },
            },
            {
                key:    'delete',
                render: elem => {
                    const confirmed = elem.agreement.toLowerCase();
                    const disabled =
                        confirmed != 'undefined' || this.props.disabled;
                    const stageDisabled = elem.stage != INACTIVE;

                    return (
                        <Popconfirm
                            disabled={ disabled || stageDisabled }
                            title={
                                <FormattedMessage id='add_order_form.delete_confirm' />
                            }
                            onConfirm={ async () => {
                                var that = this;
                                let token = localStorage.getItem(
                                    '_my.carbook.pro_token',
                                );
                                let url = __API_URL__;
                                let params = `/orders/${this.props.orderId}/labors?ids=[${elem.id}] `;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method:  'DELETE',
                                        headers: {
                                            Authorization:  token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if (result.success) {
                                        that.updateDataSource();
                                    } else {
                                        console.log('BAD', result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            } }
                        >
                            <Icon
                                type='delete'
                                className={
                                    disabled || stageDisabled
                                        ? Styles.disabledIcon
                                        : Styles.deleteIcon
                                }
                            />
                        </Popconfirm>
                    );
                },
            },
        ];
    }

    async updateTimeMultiplier(multiplier) {
        this.laborTimeMultiplier = multiplier;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ laborTimeMultiplier: multiplier }),
            });
            const result = await response.json();
            if (result.success) {
                console.log('OK', result);
            } else {
                console.log('BAD', result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    showServiceProductModal(key) {
        this.setState({
            serviceModalVisible: true,
            serviceModalKey:     key,
        });
    }
    hideServicelProductModal() {
        const { dataSource } = this.state;
        const lastService = dataSource[dataSource.length - 1];
        lastService.barcode = undefined;
        this.setState({
            serviceModalVisible: false,
        });
    }

    updateDataSource() {
        if(this.state.fetched) {
            this.setState({
                fetched: false,
            })
        }
        const callback = (data) => {
            data.orderServices.map((elem, index) => {
                elem.key = index;
            });
            this.setState({
                dataSource: data.orderServices,
                fetched: true,
            });
        }
        this.props.reloadOrderForm(callback, 'labors');
    }

    async updateLabor(key, labor) {
        this.state.dataSource[ key ] = labor;
        const data = {
            updateMode: true,
            services:   [
                {
                    id:            labor.id,
                    serviceId:     labor.laborId,
                    serviceName:   labor.serviceName,
                    employeeId:    labor.employeeId || null,
                    serviceHours:  labor.hours,
                    purchasePrice: Math.round(labor.purchasePrice * 10) / 10,
                    count:         labor.count,
                    servicePrice:  Math.round(labor.price * 10) / 10,
                    comment:       labor.comment || {
                        comment:   undefined,
                        positions: [],
                        problems:  [],
                    },
                    //stage: labor.stage,
                },
            ],
        };
        if (
            !isForbidden(
                this.props.user,
                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
            )
        ) {
            data.services[ 0 ].agreement = labor.agreement;
        }
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            this.updateDataSource();
        } catch (error) {
            console.error('ERROR:', error);
            this.updateDataSource();
        }
    }

    fetchLaborsTree() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/labors/master?makeTree=true';
        fetch(url, {
            method:  'GET',
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }

                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                that.masterLabors = data.masterLabors;
                that.buildLaborsTree();
            })
            .catch(function(error) {
                console.log('error', error);
            });
    }

    buildLaborsTree() {
        var treeData = [];
        for (let i = 0; i < this.masterLabors.length; i++) {
            const parentGroup = this.masterLabors[ i ];
            treeData.push({
                title:      `${parentGroup.defaultMasterLaborName} (#${parentGroup.masterLaborId})`,
                name:       parentGroup.defaultMasterLaborName,
                value:      parentGroup.masterLaborId,
                className:  Styles.groupTreeOption,
                key:        `${i}`,
                selectable: false,
                children:   [],
            });
            for (let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[ j ];
                treeData[ i ].children.push({
                    title:      `${childGroup.defaultMasterLaborName} (#${childGroup.masterLaborId})`,
                    name:       childGroup.defaultMasterLaborName,
                    value:      childGroup.masterLaborId,
                    className:  Styles.groupTreeOption,
                    key:        `${i}-${j}`,
                    selectable: false,
                    children:   [],
                });
                for (let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[ k ];
                    treeData[ i ].children[ j ].children.push({
                        title:     `${lastNode.defaultMasterLaborName} (#${lastNode.masterLaborId})`,
                        name:      lastNode.defaultMasterLaborName,
                        value:     lastNode.masterLaborId,
                        className: Styles.groupTreeOption,
                        key:       `${i}-${j}-${k}`,
                    });
                }
            }
        }
        this.laborsTreeData = treeData;
        this.setState({
            update: true,
        });
    }

    componentDidMount() {
        this.fetchLaborsTree();
        let tmp = [ ...this.props.orderServices ];
        tmp.map((elem, i) => elem.key = i);
        this.setState({
            dataSource: tmp,
        });
    }

    componentDidUpdate(prevProps) {
        if(
            prevProps.activeKey != 'services' && this.props.activeKey == 'services' ||
            prevProps.orderServices != this.props.orderServices
        ) {
            let tmp = [ ...this.props.orderServices ];
            tmp.map((elem, i) => elem.key = i);
            this.setState({
                dataSource: tmp,
            });
        }
    }

    render() {
        if (
            this.state.dataSource.length == 0 ||
            this.state.dataSource[ this.state.dataSource.length - 1 ].serviceName != undefined 
        ) {
            this.state.dataSource.push({
                key:         this.state.dataSource.length,
                id:          undefined,
                laborId:     undefined,
                serviceName: undefined,
                comment:     {
                    comment:   undefined,
                    positions: [],
                    problems:  [],
                },
                count:         0,
                price:         0,
                purchasePrice: 0,
                sum:           0,
                agreement:     'UNDEFINED',
            });
        }

        return (
            <Catcher>
                <Table
                    className={ Styles.serviceTable }
                    dataSource={ this.state.dataSource }
                    columns={ this.columns }
                    pagination={ false }
                />
                <AddServiceModal
                    laborTimeMultiplier={ this.props.laborTimeMultiplier }
                    defaultEmployeeId={ this.props.defaultEmployeeId }
                    normHourPrice={ this.props.normHourPrice }
                    user={ this.props.user }
                    employees={ this.props.employees }
                    visible={ this.state.serviceModalVisible }
                    updateLabor={ this.updateLabor }
                    updateDataSource={ this.updateDataSource }
                    tableKey={ this.state.serviceModalKey }
                    labor={ this.state.dataSource[ this.state.serviceModalKey ] }
                    hideModal={ () => this.hideServicelProductModal() }
                    orderId={ this.props.orderId }
                    tecdocId={ this.props.tecdocId }
                    laborsTreeData={ this.laborsTreeData }
                    labors={ this.props.labors }
                    details={ this.props.details }
                    detailsTreeData={this.props.detailsTreeData}
                />
            </Catcher>
        );
    }
}

export default ServicesTable;

@injectIntl
class QuickEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.service_type' />,
                width:     '15%',
                key:       'defaultName',
                dataIndex: 'defaultName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                width:     '15%',
                key:       'serviceName',
                dataIndex: 'serviceName',
                render:    data => {
                    return (
                        <Input
                            value={ data }
                            disabled={ this.props.confirmed || this.props.stageDisabled }
                            onChange={ event => {
                                this.state.dataSource[ 0 ].serviceName =
                                    event.target.value;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.master' />,
                width:     '10%',
                key:       'employeeId',
                dataIndex: 'employeeId',
                render:    data => {
                    return (
                        <Select
                            value={ data ? data : undefined }
                            allowClear
                            showSearch
                            style={ { minWidth: 220 } }
                            dropdownStyle={ {
                                maxHeight: 400,
                                overflow:  'auto',
                                zIndex:    '9999',
                                minWidth:  220,
                            } }
                            placeholder={ this.props.intl.formatMessage({
                                id: 'order_form_table.master',
                            }) }
                            filterOption={ (input, option) => {
                                return (
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0 ||
                                    String(option.props.value).indexOf(
                                        input.toLowerCase(),
                                    ) >= 0
                                );
                            } }
                            onChange={ (value, option) => {
                                this.state.dataSource[ 0 ].employeeId = value;
                                this.setState({
                                    update: true,
                                });
                            } }
                        >
                            { this.props.employees.map((elem, i) => (
                                <Option key={ i } value={ elem.id }>
                                    { elem.name } { elem.surname }
                                </Option>
                            )) }
                        </Select>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.purchasePrice' />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            className={ Styles.serviceNumberInput }
                            value={ Math.round(data * 10) / 10 || 0 }
                            min={ 0 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={ value => {
                                this.state.dataSource[ 0 ].purchasePrice = value;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.price' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            className={ Styles.serviceNumberInput }
                            value={ Math.round(data * 10) / 10 || 1 }
                            min={ 0 }
                            disabled={ this.props.confirmed }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={ value => {
                                this.state.dataSource[ 0 ].price = value;
                                this.state.dataSource[ 0 ].sum =
                                    value * this.state.dataSource[ 0 ].count;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'count',
                dataIndex: 'count',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            className={ Styles.serviceNumberInput }
                            value={ data ? data : 0 }
                            min={ 0 }
                            disabled={ this.props.confirmed }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={ value => {
                                this.state.dataSource[ 0 ].count = value;
                                this.state.dataSource[ 0 ].sum =
                                    value * this.state.dataSource[ 0 ].price;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:     <FormattedMessage id='services_table.norm_hours' />,
                key:       'hours',
                dataIndex: 'hours',
                width:     '3%',
                render:    (data, elem) => {
                    return (
                        <LaborsNormHourModal
                            user={ this.props.user }
                            tecdocId={ this.props.tecdocId }
                            storeGroupId={ elem.storeGroupId }
                            onSelect={ hours => {
                                elem.hours = hours;
                                elem.count = hours * this.props.laborTimeMultiplier;
                                this.setState({});
                            } }
                            hours={ data }
                        />
                    );
                },
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.sum' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            className={ Styles.serviceNumberInput }
                            disabled
                            style={ { color: 'black' } }
                            value={ Math.round(data * 10) / 10 || 1 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    );
                },
            },
        ];
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.onConfirm(this.props.tableKey, this.state.dataSource[ 0 ]);
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <>
                <Button
                    type='primary'
                    disabled={ this.props.disabled }
                    onClick={ () => {
                        this.setState({
                            visible:    true,
                            dataSource: [ this.props.labor ],
                        });
                    } }
                    title={ this.props.intl.formatMessage({ id: 'quick_edit' }) }
                >
                    <div
                        style={ {
                            width:           18,
                            height:          18,
                            backgroundColor: this.props.disabled
                                ? 'black'
                                : 'white',
                            mask:       `url(${images.pencilIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.pencilIcon}) no-repeat center / contain`,
                        } }
                    ></div>
                </Button>
                <Modal
                    width='80%'
                    visible={ this.state.visible }
                    title={
                        <FormattedMessage id='order_form_table.quick_edit' />
                    }
                    onOk={ this.handleOk }
                    onCancel={ this.handleCancel }
                    maskClosable={false}
                >
                    <Table
                        columns={ this.columns }
                        dataSource={ this.state.dataSource }
                        pagination={ false }
                    />
                </Modal>
            </>
        );
    }
}
