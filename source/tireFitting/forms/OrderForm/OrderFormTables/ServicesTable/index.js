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
    ComplexesModal,
} from 'modals';
import { AddServiceModal } from 'tireFitting';

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
                                {!isForbidden(this.props.user, permissions.ACCESS_ORDER_LABORS_COMPLEXES) &&
                                    <ComplexesModal
                                        disabled={this.props.disabled}
                                        tecdocId={this.props.tecdocId}
                                        labors={this.props.labors}
                                        details={this.props.details}
                                        detailsTreeData={this.props.detailsTreeData}
                                        orderId={this.props.orderId}
                                        reloadOrderForm={this.props.reloadOrderForm}
                                    />
                                }
                            </div>
                            
                        ),
                key:       'buttonGroup',
                dataIndex: 'key',
                render:    (data, elem) => {
                    return (
                        <div
                            style={ {
                                display:        'flex',
                                justifyContent: 'space-evenly',
                            } }
                        >
                            <Button
                                type='primary'
                                disabled={this.props.disabled}
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
                                        backgroundColor: this.props.disabled ? 'black' : 'white',
                                        mask:       `url(${images.wrenchIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.wrenchIcon}) no-repeat center / contain`,
                                        transform:  'scale(-1, 1)',
                                    } }
                                ></div>
                            </Button>
                        </div>
                    );
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
                key:    'delete',
                render: elem => {
                    return (
                        <Popconfirm
                            disabled={ this.props.disabled }
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
                                    this.props.disabled
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


    showServiceProductModal(key) {
        this.setState({
            serviceModalVisible: true,
            serviceModalKey:     key,
        });
    }
    hideServicelProductModal() {
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
                    count:         labor.count,
                    servicePrice:  Math.round(labor.price * 10) / 10,
                },
            ],
        };
       
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
        const { isMobile } = this.props;
        if (
            !isMobile && (
                this.state.dataSource.length == 0 ||
                this.state.dataSource[ this.state.dataSource.length - 1 ].serviceName != undefined
            )
        ) {
            this.state.dataSource.push({
                key:         this.state.dataSource.length,
                id:          undefined,
                laborId:     undefined,
                serviceName: undefined,
                count:         0,
                price:         0,
                sum:           0,
            });
        }

        return (
            <Catcher>
                <Table
                    className={ Styles.serviceTable }
                    dataSource={ this.state.dataSource }
                    columns={ !isMobile ? this.columns : this.columns.filter(({key})=>key != "delete" && key != "buttonGroup" && key != "employeeId") }
                    pagination={ false }
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                isMobile && this.showServiceProductModal(rowIndex);
                            },
                            onDoubleClick: event => {},
                        };
                    }}
                />
                {isMobile &&
                    <div
                        style={{
                            margin: '12px 0px 8px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <ComplexesModal
                            isMobile={isMobile}
                            disabled={this.props.disabled}
                            tecdocId={this.props.tecdocId}
                            labors={this.props.labors}
                            details={this.props.details}
                            detailsTreeData={this.props.detailsTreeData}
                            orderId={this.props.orderId}
                            reloadOrderForm={this.props.reloadOrderForm}
                        />
                        <Button
                            style={{
                                margin: '0px 0px 0px 8px',
                            }}
                            onClick={()=>this.showServiceProductModal(this.state.dataSource.length)}
                        >
                            <FormattedMessage id='add' />
                        </Button>
                    </div>
                }
                <AddServiceModal
                    isMobile={isMobile}
                    laborTimeMultiplier={ this.laborTimeMultiplier }
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