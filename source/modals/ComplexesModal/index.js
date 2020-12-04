import React, { Component } from 'react';
import { Button, Modal, Icon, Input, Table, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { permissions, isForbidden, images } from "utils";
// own
//import Styles from './styles.m.css';
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
export default class ComplexesModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
        };
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/complexes?hide=false`;
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
                fetched: true,
                dataSource: data,
            })

        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({
                fetched: true,
            });
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            fetched: false,
        })
    }

    handleOk = () => {
        this.setState({ visible: false });
        var data = {
            services: [],
            details: [],
            insertMode: true,
        }
        if(this.props.tecdocId) {
            data.modificationId = this.props.tecdocId;
        }
        this.state.servicesList.map((element)=>{
            if(element.checked && element.id != null) {
                data.services.push({
                    serviceName:
                        element.commentary && element.commentary.positions.length ?
                        element.name + ' - ' + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) :
                        element.name,
                    serviceId: element.id,
                    count: element.hours,
                    servicePrice: element.price,
                    employeeId: this.props.defaultEmployeeId,
                    serviceHours: 0,
                    comment: {
                        comment: element.commentary && element.commentary.comment,
                        positions: element.commentary && element.commentary.positions,
                        problems: element.commentary && element.commentary.problems,
                    },
                    isCritical: element.status == 3,
                })
            }
        });
        this.state.detailsList.map((element)=>{
            if(element.checked && element.id != null) {
                data.details.push({
                    name:
                        element.commentary &&  element.commentary.positions.length ?
                        element.name + ' - ' + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) :
                        element.name,
                    storeGroupId: element.id,
                    count: element.count,
                    comment: {
                        comment: element.commentary && element.commentary.comment,
                        positions: element.commentary && element.commentary.positions,
                    },
                    isCritical: element.status == 3,
                })
            }
        });
    };

    componentDidUpdate() {
        if(!this.state.fetched && this.state.visible) {
            this.fetchData();
        } 
    }

    render() { 
        const { disabled } = this.props;
        const { dataSource, filterValue } = this.state;

        return (
            <>
                <Button
                    type={'primary'}
                    disabled={disabled}
                    style={{verticalAlign: 'bottom'}}
                    onClick={()=>{
                        this.setState({visible: true})
                    }}
                >
                    <div
                        style={ {
                            width:           18,
                            height:          18,
                            backgroundColor: disabled ? 'black' : 'white',
                            mask:       `url(${images.complexesIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.complexesIcon}) no-repeat center / contain`,
                            transform:  'scale(-1, 1)',
                        } }
                    ></div>
                </Button>
                <Modal
                    width="75%"
                    visible={this.state.visible}
                    title={'Комплексы'}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {this.state.fetched ? 
                        <div>
                            
                        </div>
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </>
    )}
}