// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon } from 'antd';

// proj
import { fetchAddOrder } from 'core/orderAdd/duck';
import { Layout } from 'commons';
import { AddOrderForm } from 'forms';

// own
// import Styles from './styles.m.css';

// const mapStateToProps = (state, props) => {
//     return {
//         posts:
//         managers:
//         clients:
//         paymentMethod:
//     };
// };
//
@withRouter
@connect(null, { fetchAddOrder })
class AddOrderPage extends Component {
    componentDidMount() {
        this.props.fetchAddOrder();
    }
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='add-order-page.add_order' /> }
                controls={
                    <Icon
                        style={ { fontSize: 24, cursor: 'pointer' } }
                        type='close'
                        onClick={ () => this.props.history.goBack() }
                    />
                }
            >
                <div>Add Order Form: </div>
                <AddOrderForm />
            </Layout>
        );
    }
}

export default AddOrderPage;
