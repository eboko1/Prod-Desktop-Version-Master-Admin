// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Input} from 'antd';
import _ from 'lodash';

// proj
import {Layout, Spinner} from 'commons';

// own
import Styles from './styles.m.css';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclesPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout
                title={"Title here"}
                description={"Description"}
                controls={"Controls"}
            >
                <Tabs type="card" tabPosition="left" tabBarGutter={15}>
                    <TabPane tab="General info" key="general_info">

                        <div style={{
                            // backgroundColor: 'grey',
                            borderRadius: '0.5em'
                        }}>

                            <div>
                                <div style={{display: "inline-block", width: '55%', fontSize: '1.4em'}}>Общая информация</div>
                                <div style={{display: "inline-block", width: '40%', textAlign: 'end'}}>
                                    <Icon style={{ fontSize: '24px', margin: '5px'}} type="barcode" />
                                    <Icon style={{ fontSize: '24px', color: 'green', margin: '5px' }} type="question-circle" />
                                    <Icon style={{ fontSize: '24px', color: 'yellow', margin: '5px'}} type="edit" />
                                    <Icon style={{ fontSize: '24px', color: 'red', margin: '5px' }} type="delete" />
                                    <Icon style={{ fontSize: '24px', color: 'blue', margin: '5px' }} type="sync" />
                                    <Button type="primary"><Icon style={{ fontSize: '16px' }} type="plus" /></Button>
                                </div>
                            </div>
                            {/* ------------------------------------------------------------------- */}

                            <div style={{padding: '20px'}}>
                                <Row style={{width: '90%'}} gutter={30}>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Номер:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>VIN:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                </Row>

                                <Row style={{width: '90%'}} gutter={20}>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Автомобідь:</div></Col>
                                    <Col span={20} style={{height: '3.5em'}}><Input /></Col>
                                </Row>

                                <Row style={{width: '90%'}} gutter={20}>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Двигун:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Потужність:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                </Row>

                                <Row style={{width: '90%'}} gutter={20}>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Об'єм:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Паливо:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                </Row>

                                <Row style={{width: '90%'}} gutter={20}>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Кузов:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                    <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Привод:</div></Col>
                                    <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                </Row>

                                <Row style={{width: '90%'}} gutter={20}>
                                    <Col span={4} style={{height: '3.5em'}}></Col>
                                    <Col span={4} style={{height: '3.5em'}}><Button type="primary">Сервисная книжка</Button></Col>
                                    <Col span={8} style={{height: '3.5em'}}>
                                        <div style={{display: "inline-block", width: '40%', textAlign: 'end'}}>
                                            <Icon style={{ fontSize: '24px', margin: '5px'}} type="message" />
                                            <Icon style={{ fontSize: '24px', color: 'green', margin: '5px' }} type="mail" />
                                            <Icon style={{ fontSize: '24px', color: 'yellow', margin: '5px'}} type="copy" />
                                        </div>
                                    </Col>
                                    <Col span={8} style={{height: '3.5em'}}></Col>
                                </Row>
                            </div>

                        </div>
                        {/* ------------------------------------------------------------------------------ */}

                        <div>
                            <div style={{display: "inline-block", width: '55%', fontSize: '1.4em'}}>Клієнти</div>
                        </div>

                        <div style={{padding: '20px'}}>
                            <Row style={{width: '90%'}} gutter={30}>
                                <Col span={8} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Адрій Клієнтович</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}></div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+38(056) 863-27-39</div></Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={30}>
                                <Col span={8} style={{height: '3.5em'}}><div style={{ color: 'lightgrey', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Адрій Клієнтович</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{ color: 'lightgrey', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>до 30.02.2019</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{ color: 'lightgrey', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+38(056) 863-27-39</div></Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={30}>
                                <Col span={8} style={{height: '3.5em'}}><div style={{ color: 'lightgrey', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Адрій Клієнтович</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{ color: 'lightgrey', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>до 30.02.2019</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{ color: 'lightgrey', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+38(056) 863-27-39</div></Col>
                            </Row>
                        </div>

                        {/* ------------------------------------------------------------------------------ */}

                        <div>
                            <div style={{display: "inline-block", width: '55%', fontSize: '1.4em'}}>Останні дії і дані</div>
                        </div>

                        <div style={{padding: '20px'}}>
                            <Row style={{width: '90%'}} gutter={20}>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Запис:</div></Col>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>12.03.2021</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><Button type="primary">Відкрити останній запис</Button></Col>
                                <Col span={8} style={{height: '3.5em'}}>
                                    <div style={{display: "inline-block", width: '40%', textAlign: 'end'}}>
                                        <Icon style={{ fontSize: '24px', margin: '5px'}} type="message" />
                                        <Icon style={{ fontSize: '24px', color: 'green', margin: '5px' }} type="mail" />
                                        <Icon style={{ fontSize: '24px', color: 'yellow', margin: '5px'}} type="copy" />
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={20}>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Калькулякія:</div></Col>
                                <Col span={4} style={{height: '3.5em'}}></Col>
                                <Col span={8} style={{height: '3.5em'}}><Button type="primary">Відкрити калькуляцію</Button></Col>
                                <Col span={8} style={{height: '3.5em'}}>
                                    <div style={{display: "inline-block", width: '40%', textAlign: 'end'}}>
                                        <Icon style={{ fontSize: '24px', margin: '5px'}} type="message" />
                                        <Icon style={{ fontSize: '24px', color: 'green', margin: '5px' }} type="mail" />
                                        <Icon style={{ fontSize: '24px', color: 'yellow', margin: '5px'}} type="copy" />
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={20}>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Ремонт:</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Дзвінок:</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={20}>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Пробіг:</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>км:</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><Input /></Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={20}>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Рекомендація:</div></Col>
                                <Col span={8} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>23.12.2021</div></Col>
                                <Col span={4} style={{height: '3.5em'}}></Col>
                                <Col span={8} style={{height: '3.5em'}}></Col>
                            </Row>

                            <Row style={{width: '90%'}} gutter={20}>
                                <Col span={4} style={{height: '3.5em'}}><div style={{fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>Замінити колодки до 5,000 км</div></Col>
                                <Col span={8} style={{height: '3.5em'}}></Col>
                                <Col span={4} style={{height: '3.5em'}}></Col>
                                <Col span={8} style={{height: '3.5em'}}></Col>
                            </Row>
                        </div>



                    </TabPane>



                    <TabPane tab="Norm hours" key="norm_hours">Content 2</TabPane>
                    <TabPane tab="Orders" key="orders">Content 3</TabPane>
                    <TabPane tab="Labors" key="labors">Content 4</TabPane>
                    <TabPane tab="Spare parts" key="spare_parts">Content 5</TabPane>
                    <TabPane tab="Recommendations" key="recommendations">Content 6</TabPane>
                    {/* TODO: Change key */}
                    <TabPane tab="ТО и Интервали" key="ТО и Интервали">Content 7</TabPane>
                </Tabs>
            </Layout>
        )
    }
}