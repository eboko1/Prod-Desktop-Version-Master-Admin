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
            dataSource0: [],
            dataSource1: [],
            dataSource2: [],
            dataSource3: [],
            dataSource4: [],
            dataSource5: [],
            dataSource6: [],
            dataSource7: [],
            dataSource8: [],
            dataSource9: [],
            fetched: false,
        };

        this.columnsTypeB = [
            {
                title:     'Параметр',
                key:       'itemmptext',
                dataIndex: 'itemmptext',
                width:     '20%',
                
            },
            {
                title:     'Значение',
                key:       'valuetext',
                dataIndex: 'valuetext',
                width:     '15%',
                
            },
            {
                title:     'Е/И',
                key:       'quantitytext',
                dataIndex: 'quantitytext',
                width:     '10%',
                
            },
            {
                title:     'Комментарий 1',
                key:       'qualcoltext',
                dataIndex: 'qualcoltext',
                width:     '15%',
                
            },
            {
                title:     'Комментарий 2',
                key:       'addtext',
                dataIndex: 'addtext',
                width:     '15%',
                
            },
        ];

        this.columnsTypeA = [...this.columnsTypeB, 
            {
                title:     'Кол-во',
                key:       'count',
                dataIndex: 'count',
                width:     '5%',
                render:    (data, elem)=>{
                    return (
                       <InputNumber
                            min={0}
                            step={1}
                            value={data}
                            onChange={(value)=>{
                                elem.count = value;
                                this.setState({
                                    update: true,
                                })
                            }}
                       />
                    )
                }
                
            },
            {
                key:       'select',
                width:     '5%',
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
            fetched: false,
        })
    };

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/tecdoc/autodata?modificationId=${this.props.modificationId}`;
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
            data.map((elem, index)=>{
                elem.key = index;
                elem.count = 0;
            })
            that.setState({
                fetched: true,
                dataSource0: data.slice(0, 10),
                dataSource1: data.slice(10, 20),
                dataSource2: data.slice(20, 30),
                dataSource3: data.slice(30, 40),
                dataSource4: data.slice(40, 50),
                dataSource5: data.slice(50, 60),
                dataSource6: data.slice(60, 70),
                dataSource7: data.slice(70, 80),
                dataSource8: data.slice(80, 90),
                dataSource9: data.slice(90, 100),
            })
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }


    componentDidUpdate(prevProps, prevState) {
        if( !prevState.visible && this.state.visible) {
            this.fetchData();
        }
    }

    render() {
        const { visible } = this.state;
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
                    {this.state.fetched ? 
                        <Tabs tabPosition='left'>
                            <TabPane tab="Жидкости и литры" key="1">
                                <Table
                                    dataSource={this.state.dataSource0}
                                    columns={this.columnsTypeA}
                                    pagination={{ pageSize: 6 }}
                                />
                                <Table
                                    dataSource={this.state.dataSource1}
                                    columns={this.columnsTypeB}
                                    pagination={{ pageSize: 6 }}
                                />
                            </TabPane>
                            <TabPane tab="Интервалы" key="2">
                                <Table
                                    dataSource={this.state.dataSource2}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Лампочки" key="3">
                                <Table
                                    dataSource={this.state.dataSource3}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Тормоза" key="4">
                                <Table
                                    dataSource={this.state.dataSource4}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Электрика" key="5">
                                <Table
                                    dataSource={this.state.dataSource5}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Давление в шинах" key="6">
                                <Table
                                    dataSource={this.state.dataSource6}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Моменты затяжки" key="7">
                                <Table
                                    dataSource={this.state.dataSource7}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Углы развала" key="8">
                                <Table
                                    dataSource={this.state.dataSource8}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Прочее" key="9">
                                <Table
                                    dataSource={this.state.dataSource9}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                        </Tabs>
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </>
        )
    }
}
export default TecDocInfoModal;