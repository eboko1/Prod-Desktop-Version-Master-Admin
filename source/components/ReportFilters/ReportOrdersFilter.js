'use strict'

//vendor
import React, {Component} from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Row, Col, Menu, Checkbox, DatePicker, Input, Dropdown, Button, Icon } from 'antd';

//proj
import { StorageDateFilter } from 'components';

//own
import Style from './style.m.css';

export default class ReportOrdersFilter extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        const menu = (
            <Menu onClick={() => {console.log('menu item selected')}}>
              <Menu.Item key="1">
                <Icon type="user" />
                1st menu item
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="user" />
                2nd menu item
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="user" />
                3rd item
              </Menu.Item>
            </Menu>
          );

        return <div className={Style.filterContainer}>
            <Row type="flex" justify="center" align="stretch">
                <Col className={Style.fieldsCont} span={4}>
                        <Row className={Style.row}>
                            <Col className={Style.rowContainer} span={12}></Col>
                            <Col className={Style.rowContainer} span={6}>Work</Col>
                            <Col className={Style.rowContainer} span={6}>Parts</Col>
                        </Row>

                        <Row  className={Style.row}>
                            <Col className={Style.rowContainer} span={12}>Discount</Col>
                            <Col className={Style.rowContainer} span={6}><Checkbox /></Col>
                            <Col className={Style.rowContainer} span={6}><Checkbox /></Col>
                        </Row>

                        <Row  className={Style.row}>
                            <Col className={Style.rowContainer} span={12}>Salaries</Col>
                            <Col className={Style.rowContainer} span={6}><Checkbox /></Col>
                            <Col className={Style.rowContainer} span={6}><Checkbox /></Col>
                        </Row>

                        <Row className={Style.row}>
                            <Col className={Style.rowContainer} span={24}><Button className={Style.filterBtn}>Filter</Button></Col>
                        </Row>
                        
                        <Row  className={Style.row}><Col className={Style.rowContainer} span={25}></Col></Row>
                </Col>

                {/* ---------------------------------------------------------------------------------------------------------------------------- */}

                <Col className={Style.fieldsCont} span={4}>
                    <Row  className={Style.row}><Col className={Style.rowContainer} span={25}></Col></Row>
                    
                    <Row className={Style.row}>
                        <Col className={Style.rowContainer} span={24}><Input placeholder="Search"/></Col>
                    </Row>

                    <Row  className={Style.row}><Col className={Style.rowContainer} span={25}></Col></Row>

                    <Row className={Style.row}>
                        <Col className={Style.rowContainer} span={24}>
                            <Dropdown className={Style.statusDropdown} overlay={menu}>
                                <Button onClick={() => {console.log('click')}}>
                                    Select Status <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                    
                    <Row  className={Style.row}><Col className={Style.rowContainer} span={25}></Col></Row>
                </Col>

                {/* ---------------------------------------------------------------------------------------------------------------------------- */}

                <Col className={Style.fieldsCont} span={8}>

                <Row  className={Style.row}><Col className={Style.rowContainer} span={25}></Col></Row>

                    <Row  className={Style.row}>
                        <Col className={Style.rowContainer} span={7}>Creation</Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker /></Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker /></Col>
                        <Col className={Style.rowContainer} span={3}><StorageDateFilter minimize /></Col>
                    </Row>

                    <Row  className={Style.row}>
                        <Col className={Style.rowContainer} span={7}>Appointment</Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker /></Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker /></Col>
                        <Col className={Style.rowContainer} span={3}><StorageDateFilter minimize /></Col>
                    </Row>

                    <Row  className={Style.row}>
                        <Col className={Style.rowContainer} span={7}>Done</Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker /></Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker /></Col>
                        <Col className={Style.rowContainer} span={3}><StorageDateFilter minimize /></Col>
                    </Row>
                    
                    <Row  className={Style.row}><Col className={Style.rowContainer} span={25}></Col></Row>
                </Col>

                {/* ---------------------------------------------------------------------------------------------------------------------------- */}

                <Col className={Style.fieldsCont} span={8}>

                    <Row gutter={[0, 1]} className={Style.row}>
                        <Col className={Style.rowContainer} span={6}></Col>
                        <Col className={Style.rowContainer} span={6}>Labors</Col>
                        <Col className={Style.rowContainer} span={6}>Parts</Col>
                        <Col className={Style.rowContainer} span={6}>Total</Col>
                    </Row>

                    <Row gutter={[0, 1]} className={Style.row}>
                        <Col className={Style.rowContainer} span={6}>Amount</Col>
                        <Col className={Style.rowContainer} span={6}>123</Col>
                        <Col className={Style.rowContainer} span={6}>456</Col>
                        <Col className={Style.rowContainer} span={6}>579</Col>
                    </Row>

                    <Row gutter={[0, 1]} className={Style.row}>
                        <Col className={Style.rowContainer} span={6}>Profit</Col>
                        <Col className={Style.rowContainer} span={6}>123</Col>
                        <Col className={Style.rowContainer} span={6}>456</Col>
                        <Col className={Style.rowContainer} span={6}>579</Col>
                    </Row>

                    <Row gutter={[0, 1]} className={Style.row}>
                        <Col className={Style.rowContainer} span={6}>Margin %</Col>
                        <Col className={Style.rowContainer} span={6}>100%</Col>
                        <Col className={Style.rowContainer} span={6}>100%</Col>
                        <Col className={Style.rowContainer} span={6}>100%</Col>
                    </Row>

                    <Row gutter={[0, 1]} className={Style.row}>
                        <Col className={Style.rowContainer} span={24}>Clients count: 123456</Col>
                    </Row>
                </Col>

            </Row>
        </div>
    }
}