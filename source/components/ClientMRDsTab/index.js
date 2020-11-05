// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Rate, Row, Col, Collapse, DatePicker } from 'antd';
import moment from 'moment';

const { Panel } = Collapse;

// proj
import {
    fetchClientMRDs,
    setFilterDate,
    //setClientOrdersPageFilter,
} from 'core/clientMRDs/duck';

import { Numeral, Loader } from 'commons';
import { FormattedDatetime, OrderStatusIcon } from 'components';

// own
import book from 'routes/book';
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'DD/MM/YYYY';

const mapStateToProps = state => ({
    isFetching: state.ui.clientMRDsFetching,
    MRDDate: state.clientMRDs.filter.MRDDate,
    mrds: state.clientMRDs.mrds,
    //filter:     state.clientOrders.filter,
});

const mapDispatchToProps = {
    fetchClientMRDs,
    setFilterDate,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientMRDsTab extends Component {
    constructor(props) {
        super(props);
        
        this.onDatePicker.bind(this);
    }

    componentDidMount() {
        const { clientId } = this.props;
        
        this.props.setFilterDate(moment().format(DEF_DATE_FORMAT));
        this.props.fetchClientMRDs({ clientId });
        // console.log("=============", clientId);
        
    }

    onDatePicker(date) {
        const { clientId } = this.props;

        this.props.setFilterDate(date.format(DEF_DATE_FORMAT));
        this.props.fetchClientMRDs({ clientId });
    }

    render() {
        const {
            isFetching,
            mrds,
        } = this.props;
        if (isFetching) {
            return <Loader loading={ isFetching } />;
        }
        //console.log("MRDs from comp", mrds);
        // if(mrds) mrds.forEach(element => {
        //     console.log(element);

        // })

        //console.log(this.props.MRDDate);

        return (
            <>
                <div className={Styles.headerContainer}>
                    <DatePicker
                        allowClear={false}
                        defaultValue={moment(this.props.MRDDate, DEF_DATE_FORMAT)}
                        format={DEF_DATE_FORMAT}
                        onChange={date => this.onDatePicker(date)}></DatePicker
                    >
                </div>
                <Collapse>
                    {mrds.map(element => {
                        const {cashOrders} = element;
                        return <Panel
                                header={
                                    <Row>
                                        <Col span={6}>{element.documentType}</Col>
                                        <Col span={6}>{<FormattedMessage id='client_mrds_tab.amoun'/>}: {element.amount}</Col>
                                        <Col span={6}><FormattedMessage id='client_mrds_tab.due_amount'/>: {element.dueAmount}</Col>
                                        <Col span={6}>{element.orderDatetime}</Col>
                                    </Row>
                                }
                                key = {element.orderId}
                                className={Styles.payDocsContainer}
                                >
                                    <div className={Styles.payDocsContainer} key={element.id}>
                                        {cashOrders.map(item => {
                                            return(
                                                <Row
                                                key={item.id}
                                                className= {
                                                    item.documentType.toString() == "PAY-P"
                                                    ? [Styles.payDoc, Styles.payPDoc].join(' ')
                                                    : [Styles.payDoc, Styles.payMDoc].join(' ')}
                                                >
                                                    <Col key='1' span={6}>{item.documentType}</Col>
                                                    <Col key='2' span={6}>{item.amount}</Col>
                                                    <Col key='3' span={6}>{item.datetime}</Col>
                                                </Row>
                                            )
                                        })}
                                    </div>
                                </Panel>
                    })}
                </Collapse>
            </>
        );
    }
}
