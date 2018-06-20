// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Radio } from 'antd';

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
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@withRouter
class OrdersPage extends Component {
    state = {
        radioDateRange: 'all',
    };

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

    handleRadioDateRange(ev) {
        this.setState({ handleRadioDateRange: ev.target.value });
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
                        <RadioGroup
                            defaultValue={ this.state.radioDateRange }
                            onChange={ ev => this.handleRadioDateRange(ev) }
                            className={ Styles.filters }
                        >
                            <RadioButton value='all'>
                                <FormattedMessage id='orders-page.all' />
                            </RadioButton>
                            <RadioButton value='today'>
                                <FormattedMessage id='orders-page.today' />
                            </RadioButton>
                            <RadioButton value='tomorrow'>
                                <FormattedMessage id='orders-page.tomorrow' />
                            </RadioButton>
                            <RadioButton value='week'>
                                <FormattedMessage id='orders-page.week' />
                            </RadioButton>
                            <RadioButton value='month'>
                                <FormattedMessage id='orders-page.month' />
                            </RadioButton>
                        </RadioGroup>
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
