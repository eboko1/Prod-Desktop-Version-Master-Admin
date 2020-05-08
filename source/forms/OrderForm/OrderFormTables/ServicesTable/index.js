// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, InputNumber, Icon, Popconfirm, Select, Input, Button, Modal } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { images } from 'utils';
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import {
    permissions,
    isForbidden,
    numeralFormatter,
    numeralParser,
} from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
class ServicesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }

        this.columns = [
            {
                width: "8%",
                key: "buttonGroup",
                dataIndex: "key",
                render: (data, elem) => {
                    const confirmed = elem.agreement.toLowerCase();
                    return (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <Button
                                type='primary'
                                disabled={confirmed != "undefined"}
                                onClick={()=>{
                                    this.showDetailProductModal(data)
                                }}
                            >
                                <div
                                    style={{
                                        width: 24,
                                        height: 24,
                                        backgroundColor: 'white',
                                        mask: `url(${images.partsIcon}) no-repeat center / contain`,
                                        '-webkit-mask': `url(${images.partsIcon}) no-repeat center / contain`,
                                    }}
                                ></div>
                            </Button>
                        </div>
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.detail_name" />,
                width: "15%",
                key: "detail",
                dataIndex: 'detailName',
                render: (data) => {
                        return (
                            data ? data : <FormattedMessage id="long_dash"/>
                        )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.brand" />,
                width: "10%",
                key: "brand",
                dataIndex: 'brandName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.detail_code" />,
                width: "10%",
                key: "code",
                dataIndex: 'detailCode',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.supplier" />,
                width: "10%",
                key: "supplierName",
                dataIndex: 'supplierName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.AI" />,
                width: "3%",
                key: "AI",
                render: (elem)=>{
                    let color = 'brown',
                        title = 'Поставщик не выбран!';
                    if(elem.store){
                        title=  `Сегодня: ${elem.store[0]} шт.\n` +
                                `Завтра: ${elem.store[1]} шт.\n` +
                                `Послезавтра: ${elem.store[2]} шт.\n` +
                                `Позже: ${elem.store[3]} шт.`;
                        if(elem.store[0] != '0') {
                            color = 'rgb(81, 205, 102)';
                        }
                        else if(elem.store[1] != 0) {
                            color = 'yellow';
                        }
                        else if(elem.store[2] != 0) {
                            color = 'orange';
                        }
                        else if(elem.store[3] != 0) {
                            color = 'red';
                        }
                    }
                    else {
                        color = 'grey';
                        
                    }
                    
                    return (
                        <div
                            style={{borderRadius: '50%', width: 18, height: 18, backgroundColor: color}}
                            title={title}
                        ></div>
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.purchasePrice" />,
                width: "5%",
                key: "purchasePrice",
                dataIndex: 'purchasePrice',
                render: (data) => {
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.price" />,
                width: "5%",
                key: "price",
                dataIndex: 'price',
                render: (data) => {
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.count" />,
                width: "5%",
                key: "count",
                dataIndex: 'count',
                render: (data) => {
                    let strVal = String(data);
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="pc" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.sum" />,
                width: "10%",
                key: "sum",
                dataIndex: 'sum',
                render: (data) => {
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.status' />,
                width: "8%",
                key: 'agreement',
                dataIndex: 'agreement',
                render: (data, elem) => {
                    const key = elem.key;
                    const confirmed = this.state.dataSource[key].agreement.toLowerCase();
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
                        <Input
                            disabled
                            style={{color: color}}
                            value={this.props.intl.formatMessage({
                                id: `status.${confirmed}`,
                            })}
                        />
                    )
                },
            },
            {
                width: "2%",
                key: "favourite",
                render: (elem)=>{
                    return(
                        <Icon
                            type="star"
                            theme={elem.fav ? 'filled' : ''}
                            style={{color: 'gold', fontSize: 18}}
                            onClick={()=>{
                                this.state.dataSource[elem.key].fav = !Boolean(this.state.dataSource[elem.key].fav);
                                this.setState({
                                    update: true,
                                })
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
                            title={
                                <FormattedMessage id="add_order_form.delete_confirm" />
                            }
                            onConfirm={async ()=>{
                                var that = this;
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = API_URL;
                                let params = `/orders/${this.props.orderId}/details?ids=[${elem.id}] `;
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
                            <Icon type="delete" className={Styles.deleteIcon} />
                        </Popconfirm>
                    );
                },
            },
        ]
    }

    render() {
        return (
            <Catcher>
                <Table
                    className={ Styles.serviceTable }
                    dataSource={ this.state.dataSource }
                    columns={ this.columns }
                />
            </Catcher>
        );
    }
}

export default ServicesTable;

class CommentaryModal extends React.Component {
    state = { visible: false };

    showModal = () => {
        this.setState({
        visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
        visible: false,
        });
    };


    handleCancel = e => {
        console.log(e);
        this.setState({
        visible: false,
        });
    };


    render() {
        return (
        <div>
            <Icon type="message" onClick={this.showModal}/>
            <Modal
                title={<FormattedMessage id='order_form_table.diagnostic.commentary' />}
                footer={null}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
            <p>{this.props.comment ? this.props.comment : <FormattedMessage id='no_data' />}</p>
            </Modal>
        </div>
        );
    }
}