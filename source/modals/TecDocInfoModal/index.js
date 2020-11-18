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

            parameterFilter: undefined,
            valueFilter: undefined,
            unitsFilter: undefined,
            firstCommentFilter: undefined,
            secondCommentFilter: undefined,
        };

        this.columnsTypeB = [
            {
                title:     ()=>{
                    return (
                        <div>
                            <FormattedMessage id="info_modal.parameter" />
                            <Input
                                allowClear
                                value={this.state.parameterFilter}
                                onChange={(event)=>{
                                    const { value } = event.target;
                                    this.setState({
                                        parameterFilter: value,
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'itemmptext',
                dataIndex: 'itemmptext',
                
            },
            {
                title:     ()=>{
                    return (
                        <div>
                            <FormattedMessage id="info_modal.value" />
                            <Input
                                allowClear
                                value={this.state.valueFilter}
                                onChange={(event)=>{
                                    const { value } = event.target;
                                    this.setState({
                                        valueFilter: value,
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'valuetext',
                dataIndex: 'valuetext',
                
            },
            {
                title:     ()=>{
                    return (
                        <div>
                            <FormattedMessage id="info_modal.units" />
                            <Input
                                allowClear
                                value={this.state.unitsFilter}
                                onChange={(event)=>{
                                    const { value } = event.target;
                                    this.setState({
                                        unitsFilter: value,
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'quantitytext',
                dataIndex: 'quantitytext',
                
            },
            {
                title:     ()=>{
                    return (
                        <div>
                            <FormattedMessage id="comment" /> 1
                           <Input
                                allowClear
                                value={this.state.firstCommentFilter}
                                onChange={(event)=>{
                                    const { value } = event.target;
                                    this.setState({
                                        firstCommentFilter: value,
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'qualcoltext',
                dataIndex: 'qualcoltext',
                
            },
            {
                title:     ()=>{
                    return (
                        <div>
                            <FormattedMessage id="comment" /> 2
                            <Input
                                allowClear
                                value={this.state.secondCommentFilter}
                                onChange={(event)=>{
                                    const { value } = event.target;
                                    this.setState({
                                        secondCommentFilter: value,
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'addtext',
                dataIndex: 'addtext',
                
            },
        ];

        this.columnsTypeA = [...this.columnsTypeB, 
            {
                key:       'select',
                width:     'auto',
                render:    (elem)=>{
                    return (
                        <Button
                            type='primary'
                            onClick={()=>{
                                console.log(elem);
                                if(this.props.showOilModal) this.props.showOilModal(elem.oem[0], elem.oeCode, elem.acea, elem.api, elem.sae);
                                this.handleCancel();
                            }}
                        >
                            <FormattedMessage id='add'/>
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
            parameterFilter: undefined,
            valueFilter: undefined,
            unitsFilter: undefined,
            firstCommentFilter: undefined,
            secondCommentFilter: undefined,
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
            that.setState({
                fetched: true,
                dataSource0: data.specifications.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource1: data.capacity.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource2: data.intervals.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource3: data.lightBulbs.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource4: data.brakes.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource5: data.electric.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource6: data.tirePressure.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource7: data.tighteningTorques.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource8: data.camberAngles.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
                dataSource9: data.others.map((elem,i)=>{elem.key = i; elem.count = 1; return elem}),
            })
        })
        .catch(function (error) {
            that.setState({
                fetched: true,
            })
        })
    }


    componentDidUpdate(prevProps, prevState) {
        if( !prevState.visible && this.state.visible) {
            this.fetchData();
        }
    }

    render() {
        const {
            visible,
            parameterFilter,
            valueFilter,
            unitsFilter,
            firstCommentFilter,
            secondCommentFilter,

            dataSource0,
            dataSource1,
            dataSource2,
            dataSource3,
            dataSource4,
            dataSource5,
            dataSource6,
            dataSource7,
            dataSource8,
            dataSource9,
        } = this.state;

        var dt0 = [...dataSource0],
              dt1 = [...dataSource1],
              dt2 = [...dataSource2],
              dt3 = [...dataSource3],
              dt4 = [...dataSource4],
              dt5 = [...dataSource5],
              dt6 = [...dataSource6],
              dt7 = [...dataSource7],
              dt8 = [...dataSource8],
              dt9 = [...dataSource9]


        if(parameterFilter) {
            dt0 = dt0.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt1 = dt1.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt2 = dt2.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt3 = dt3.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt4 = dt4.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt5 = dt5.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt6 = dt6.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt7 = dt7.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt8 = dt8.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
            dt9 = dt9.filter((elem)=>elem.itemmptext && elem.itemmptext.toLowerCase().indexOf(parameterFilter.toLowerCase()) >= 0);
        }
        if(valueFilter) {
            dt0 = dt0.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt1 = dt1.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt2 = dt2.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt3 = dt3.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt4 = dt4.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt5 = dt5.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt6 = dt6.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt7 = dt7.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt8 = dt8.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
            dt9 = dt9.filter((elem)=>elem.valuetext && elem.valuetext.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0);
        }
        if(unitsFilter) {
            dt0 = dt0.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt1 = dt1.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt2 = dt2.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt3 = dt3.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt4 = dt4.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt5 = dt5.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt6 = dt6.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt7 = dt7.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt8 = dt8.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
            dt9 = dt9.filter((elem)=>elem.quantitytext && elem.quantitytext.toLowerCase().indexOf(unitsFilter.toLowerCase()) >= 0);
        }
        if(firstCommentFilter) {
            dt0 = dt0.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt1 = dt1.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt2 = dt2.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt3 = dt3.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt4 = dt4.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt5 = dt5.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt6 = dt6.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt7 = dt7.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt8 = dt8.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
            dt9 = dt9.filter((elem)=>elem.qualcoltext && elem.qualcoltext.toLowerCase().indexOf(firstCommentFilter.toLowerCase()) >= 0);
        }
        if(secondCommentFilter) {
            dt0 = dt0.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt1 = dt1.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt2 = dt2.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt3 = dt3.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt4 = dt4.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt5 = dt5.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt6 = dt6.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt7 = dt7.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt8 = dt8.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
            dt9 = dt9.filter((elem)=>elem.addtext && elem.addtext.toLowerCase().indexOf(secondCommentFilter.toLowerCase()) >= 0);
        }

        return (
            <>
                <Icon
                    type='question-circle'
                    style={ {
                        fontSize: this.props.isMobile ? 14 : 24,
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
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    {this.state.fetched ? 
                        <Tabs tabPosition='left'>
                            <TabPane tab="Жидкости" key="1">
                                <div className={Styles.tableHeader}>Спецификации масел и технических жидкостей</div>
                                <Table
                                    dataSource={dt0}
                                    columns={this.columnsTypeA}
                                />
                                
                            </TabPane>
                            <TabPane tab="Литры" key="2">
                                <div className={Styles.tableHeader}>Объёмы масел и технических жидкостей</div>
                                <Table
                                    dataSource={dt1}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Интервалы" key="3">
                                <div className={Styles.tableHeader}>Интервалы замены запчастей, масел и жидкостей</div>
                                <Table
                                    dataSource={dt2}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Лампочки" key="4">
                                <div className={Styles.tableHeader}>Спецификации автолампочек</div>
                                <Table
                                    dataSource={dt3}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Тормоза" key="5">
                                <div className={Styles.tableHeader}>Параметры тормозов</div>
                                <Table
                                    dataSource={dt4}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Электрика" key="6">
                                <div className={Styles.tableHeader}>Данные по электрике автомобиля</div>
                                <Table
                                    dataSource={dt5}
                                    columns={this.columnsTypeA}
                                />
                            </TabPane>
                            <TabPane tab="Давление в шинах" key="7">
                                <div className={Styles.tableHeader}>Давление в шинах</div>
                                <Table
                                    dataSource={dt6}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Моменты затяжки" key="8">
                                <div className={Styles.tableHeader}>Моменты затяжки креплений узлов и деталей</div>
                                <Table
                                    dataSource={dt7}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Углы развала" key="9">
                                <div className={Styles.tableHeader}>Углы развала-схождения автомобиля</div>
                                <Table
                                    dataSource={dt8}
                                    columns={this.columnsTypeB}
                                />
                            </TabPane>
                            <TabPane tab="Прочее" key="10">
                                <div className={Styles.tableHeader}>Прочие параметры</div>
                                <Table
                                    dataSource={dt9}
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