// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, Tabs, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;
const { Option } = Select;  
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
class TecDocInfoModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
        };
        
        this.columnsTypeA = [
            {
                title:     'Параметр',
                key:       'parametr',
                width:     '20%',
                
            },
            {
                title:     'Значение',
                key:       'value',
                width:     '15%',
                
            },
            {
                title:     'Е/И',
                key:       'ei',
                width:     '5%',
                
            },
            {
                title:     'Комментарий 1',
                key:       'comment1',
                width:     '15%',
                
            },
            {
                title:     'Комментарий 2',
                key:       'comment2',
                width:     '15%',
                
            },
            {
                title:     'Кол-во',
                key:       'count',
                width:     '5%',
                render:    ()=>{
                    return (
                       <InputNumber
                            min={0}
                       />
                    )
                }
                
            },
            {
                key:       'select',
                width:     '10%',
                render:    ()=>{
                    return (
                        <Button
                            type='primary'
                        >
                            <FormattedMessage id='select'/>
                        </Button>
                    )
                }
                
            },
        ];

        this.columnsTypeB = [
            {
                title:     'Параметр',
                key:       'parametr',
                width:     '20%',
                
            },
            {
                title:     'Значение',
                key:       'value',
                width:     '15%',
                
            },
            {
                title:     'Е/И',
                key:       'ei',
                width:     '5%',
                
            },
            {
                title:     'Комментарий 1',
                key:       'comment1',
                width:     '15%',
                
            },
            {
                title:     'Комментарий 2',
                key:       'comment2',
                width:     '15%',
                
            },
        ];

        this.tabsData = [
            {
                name: '',
                type: 'A',
                title: '',
            }
        ]
    }

    handleOk = () => {
        
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };

    fetchData() {
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
            data.labors.map((elem, index)=>{
                elem.key = index;
                elem.laborCode = `${elem.masterLaborId}-${elem.productId}`;
            })
            that.labors = data.labors;
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/labors/master?makeTree=true`;
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
            that.masterLabors = data.masterLabors;
            that.buildLaborsTree();
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/store_groups`;
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
            that.storeGroups = data;
            that.buildStoreGroupsTree();
            that.getOptions();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }


    componentDidUpdate(prevProps, prevState) {
        if( !prevState.visible && this.state.visible) {

        }
    }

    render() {
        const { visible, dataSource } = this.state;
        return (
            <>
                <Icon
                    type='question-circle'
                    style={ {
                        fontSize: this.props.isMobile ? 12 : 24,
                        cursor:   'pointer',
                        margin:   '0 10px',
                    } }
                    onClick={()=>{
                        this.setState({
                            visible: true,
                        })
                    }}
                />
                <Modal
                    width="95%"
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <Tabs tabPosition='left'>
                        <TabPane tab="Жидкости и литры" key="1">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeA}
                                pagination={false}
                            />
                             <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeB}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Интервалы" key="2">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeA}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Лампочки" key="3">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeA}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Тормоза" key="4">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeA}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Электрика" key="5">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeA}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Давление в шинах" key="6">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeB}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Моменты затяжки" key="7">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeB}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Углы развала" key="8">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeB}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="Прочее" key="9">
                            <Table
                                dataSource={dataSource}
                                columns={this.columnsTypeB}
                                pagination={false}
                            />
                        </TabPane>
                    </Tabs>
                    
                </Modal>
            </>
        )
    }
}
export default TecDocInfoModal;