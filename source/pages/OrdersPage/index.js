// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

// proj
import { Layout } from 'commons';
import {
    OrdersContainer,
    FunelContainer,
    OrdersFilterContainer,
    UniversalFilters,
} from 'containers';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
const ButtonGroup = Button.Group;

@withRouter
class OrdersPage extends Component {
    getPageTitle() {
        const status = this.props.match.params.ordersStatuses;
        switch (status) {
            case 'appointments':
                return <FormattedMessage id='appointments' />;
            case 'approved':
                return <FormattedMessage id='records' />;
            case 'in-progress':
                return <FormattedMessage id='repairs' />;
            case 'success':
                return <FormattedMessage id='done' />;
            case 'reviews':
                return <FormattedMessage id='reviews' />;
            case 'invitations':
                return <FormattedMessage id='invitations' />;
            case 'canceled':
                return <FormattedMessage id='cancels' />;

            default:
                return <FormattedMessage id='orders-page.title' />;
        }
    }

    render() {
        const status = this.props.match.params.ordersStatuses;

        return (
            <Layout
                paper={ false }
                title={ this.getPageTitle() }
                description={ <FormattedMessage id='orders-page.description' /> }
                controls={
                    <div className={ Styles.controls }>
                        <ButtonGroup className={ Styles.filters }>
                            <Button>
                                <FormattedMessage id='orders-page.all' />
                            </Button>
                            <Button>
                                <FormattedMessage id='orders-page.today' />
                            </Button>
                            <Button>
                                <FormattedMessage id='orders-page.tomorrow' />
                            </Button>
                            <Button>
                                <FormattedMessage id='orders-page.week' />
                            </Button>
                            <Button>
                                <FormattedMessage id='orders-page.month' />
                            </Button>
                        </ButtonGroup>
                        <div className={ Styles.buttonGroup }>
                            { (status === 'canceled' ||
                                status === 'success') && (
                                <Button type='primary'>
                                    <FormattedMessage id='orders-page.invite_to_service' />
                                </Button>
                            ) }
                            <Link to={ book.addOrder }>
                                <Button type='primary'>
                                    <FormattedMessage id='orders-page.add_appointment' />
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            >
                <section className={ Styles.funelWithFilters }>
                    <FunelContainer />
                    <OrdersFilterContainer status={ status } />
                </section>
                { (status === 'success' || status === 'canceled') && (
                    <UniversalFilters />
                ) }
                <section className={ Styles.ordersWrrapper }>
                    <OrdersContainer />
                </section>
            </Layout>
        );
    }
}

export default OrdersPage;
