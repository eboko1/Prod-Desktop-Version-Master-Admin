// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Button, Icon } from 'antd';

// proj
import { fetchOrder, fetchReport } from 'core/order/duck';
import { Layout } from 'commons';
import { OrderForm } from 'forms';
import { ReportsDropdown } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = (state, props) => {
    return {
        order: {
            status:   state.order.order.status,
            num:      state.order.order.num,
            datetime: state.order.order.datetime,
            // id:       state.order.order.id,
        },
    };
};

@withRouter
@connect(mapStateToProps, { fetchOrder, fetchReport })
class OrderPage extends Component {
    componentDidMount() {
        this.props.fetchOrder(this.props.match.params.id);
    }

    render() {
        // destruct order
        const { num, status, datetime } = this.props.order;

        const id = this.props.match.params.id;
        //
        // const printAct = (name, reportType) => ({
        //     name: name,
        //     link: `${book.reports}${reportType}/${id}`,
        // });
        // const printAct = (name, reportType) => ({
        //     name: name,
        //     link: `${book.reports}${reportType}/${id}`,
        // });
        console.log('orderId', typeof id);

        const reports = [];

        const calculationReport = {
            name: 'calculationReport',
            link: `${book.reports}/calculationReport/${id}`,
        };
        const businessOrderReport = {
            name: 'businessOrderReport',
            link: `${book.reports}/businessOrderReport/${id}`,
        };
        const clientOrderReport = {
            name: 'clientOrderReport',
            link: `${book.reports}/clientOrderReport/${id}`,
        };
        const diagnosticsActReport = {
            name: 'clientOrderReport',
            link: () => this.props.fetchReport('diagnosticsActReport', id),
            // link: `${book.reports}/diagnosticsActReport/${id}`,
        };
        const actOfAcceptanceReport = {
            name: 'actOfAcceptanceReport',
            // link: this.props.fetchReport(
            //     `${book.reports}/actOfAcceptanceReport/${id}`,
            // ),
            link: () => {
                console.log('AAA', id);
                this.props.fetchReport({
                    reportType: 'actOfAcceptanceReport',
                    id,
                });
            },
            // link: `${book.reports}/actOfAcceptanceReport/${id}`,
        };

        console.log('PRINTstatus', status);
        switch (status) {
            case 'approve':
                reports.push(actOfAcceptanceReport, diagnosticsActReport);
                break;
            case 'success':
                break;
            default:
                reports.push(clientOrderReport);
                break;
        }

        // calculationReport - калькуляция
        //
        // businessOrderReport -> наряд заказ в цех
        //
        // clientOrderReport -> наряд заказ
        //
        // diagnosticsActReport -> акт диагностики
        //
        // actOfAcceptanceReport -> акт приема работ

        return (
            <Layout
                title={
                    <>
                        <FormattedMessage
                            id={ `order-status.${status || 'order'}` }
                        />
                        {console.log('num', num)}
                        {` ${num}`}
                    </>
                }
                description={
                    <>
                        <FormattedMessage id='order-page.creation_date' />
                        {`: ${moment(datetime).format('DD MMMM YYYY, HH:mm')}`}
                    </>
                }
                controls={
                    <>
                        <ReportsDropdown reports={ reports } />
                        <Icon
                            style={ { fontSize: 24, cursor: 'pointer' } }
                            type='close'
                            onClick={ () => this.props.history.goBack() }
                        />
                    </>
                }
            >
                <div>Order Form: { id }</div>
                <OrderForm />
            </Layout>
        );
    }
}

export default OrderPage;
// moment(datetime).format('DD MMMM YYYY, HH:mm')
