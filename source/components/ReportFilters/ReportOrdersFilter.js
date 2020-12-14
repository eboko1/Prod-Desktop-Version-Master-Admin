'use strict'

//vendor
import React, {Component} from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Row, Col, Menu, Checkbox, DatePicker, Input, Dropdown, Button, Icon } from 'antd';

//proj
import { DateRangePicker } from 'components';

//own
import Style from './style.m.css';

const DEF_DATE_FORMAT = 'YYYY/MM/DD';
const DEF_UI_DATE_FORMAT = 'DD/MM/YYYY';

export default class ReportOrdersFilter extends Component {

    constructor(props) {
        super(props);

        this.onIncludeLaborsDiscountChanged = this.onIncludeLaborsDiscountChanged.bind(this);
        this.onIncludeAppurtenanciesDiscountChanged = this.onIncludeAppurtenanciesDiscountChanged.bind(this);

        this.onSearchInput = this.onSearchInput.bind(this);

        this.onCreationFromDateChanged = this.onCreationFromDateChanged.bind(this);
        this.onCreationToDateChanged = this.onCreationToDateChanged.bind(this);

        this.onAppointmentFromDateChanged = this.onAppointmentFromDateChanged.bind(this);
        this.onAppointmentToDateChanged = this.onAppointmentToDateChanged.bind(this);

        this.onDoneFromDateChanged = this.onDoneFromDateChanged.bind(this);
        this.onDoneToDateChanged = this.onDoneToDateChanged.bind(this);
    }

    //Handlers---------------------------------------------------------------
    onIncludeLaborsDiscountChanged(e) {
        const {fetchReportOrders, setReportOrdersIncludeServicesDiscount} = this.props.filterControls;
        setReportOrdersIncludeServicesDiscount(e.target.checked);
        fetchReportOrders();
    }

    onIncludeAppurtenanciesDiscountChanged(e) {
        const {fetchReportOrders, setReportOrdersIncludeAppurtenanciesDiscount} = this.props.filterControls;
        setReportOrdersIncludeAppurtenanciesDiscount(e.target.checked);
        fetchReportOrders();
    }

    onSearchInput(e) {
        const {fetchReportOrders, setReportOrdersQuery} = this.props.filterControls;
        setReportOrdersQuery(e.target.value.toLowerCase().trim());
        fetchReportOrders();
    }

    onCreationFromDateChanged(date) {
        const {fetchReportOrders, setReportOrdersCreationFromDate} = this.props.filterControls;
        setReportOrdersCreationFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    onCreationToDateChanged(date) {
        const {fetchReportOrders, setReportOrdersCreationToDate} = this.props.filterControls;
        setReportOrdersCreationToDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    onAppointmentFromDateChanged(date) {
        const {fetchReportOrders, setReportOrdersAppointmentFromDate} = this.props.filterControls;
        setReportOrdersAppointmentFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    onAppointmentToDateChanged(date) {
        const {fetchReportOrders, setReportOrdersAppointmentToDate} = this.props.filterControls;
        setReportOrdersAppointmentToDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    onDoneFromDateChanged(date) {
        const {fetchReportOrders, setReportOrdersDoneFromDate} = this.props.filterControls;
        setReportOrdersDoneFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    onDoneToDateChanged(date) {
        const {fetchReportOrders, setReportOrdersDoneToDate} = this.props.filterControls;
        setReportOrdersDoneToDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }
    //-----------------------------------------------------------------------


    render() {

        const {filterControls} = this.props;

        const {
            fetchReportOrders,

            setReportOrdersIncludeServicesDiscount,
            setReportOrdersIncludeAppurtenanciesDiscount,
            includeServicesDiscount,
            includeAppurtenanciesDiscount,

            setReportOrdersQuery,
            setReportOrdersStatus,
            setReportOrdersCreationFromDate,
            setReportOrdersCreationToDate,
            setReportOrdersAppointmentFromDate,
            setReportOrdersAppointmentToDate,
            setReportOrdersDoneFromDate,
            setReportOrdersDoneToDate,
        } = filterControls;

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
                            <Col className={Style.rowContainer} span={6}><Checkbox defaultChecked={includeServicesDiscount} onChange={this.onIncludeLaborsDiscountChanged} /></Col>
                            <Col className={Style.rowContainer} span={6}><Checkbox defaultChecked={includeAppurtenanciesDiscount} onChange={this.onIncludeAppurtenanciesDiscountChanged}/></Col>
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
                        <Col className={Style.rowContainer} span={24}><Input onChange={this.onSearchInput} placeholder="Search"/></Col>
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
                        <Col className={Style.rowContainer} span={7}><DatePicker onChange={this.onCreationFromDateChanged} format={DEF_UI_DATE_FORMAT}/></Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker onChange={this.onCreationToDateChanged} format={DEF_UI_DATE_FORMAT} /></Col>
                        <Col className={Style.rowContainer} span={3}><DateRangePicker minimize /></Col>
                    </Row>

                    <Row  className={Style.row}>
                        <Col className={Style.rowContainer} span={7}>Appointment</Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker onChange={this.onAppointmentFromDateChanged} format={DEF_UI_DATE_FORMAT} /></Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker onChange={this.onAppointmentToDateChanged} format={DEF_UI_DATE_FORMAT} /></Col>
                        <Col className={Style.rowContainer} span={3}><DateRangePicker minimize /></Col>
                    </Row>

                    <Row  className={Style.row}>
                        <Col className={Style.rowContainer} span={7}>Done</Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker onChange={this.onDoneFromDateChanged} format={DEF_UI_DATE_FORMAT} /></Col>
                        <Col className={Style.rowContainer} span={7}><DatePicker onChange={this.onDoneToDateChanged} format={DEF_UI_DATE_FORMAT} /></Col>
                        <Col className={Style.rowContainer} span={3}><DateRangePicker minimize /></Col>
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