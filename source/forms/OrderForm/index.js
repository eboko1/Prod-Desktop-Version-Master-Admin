// vendor
import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router';

// proj
// import { fetchOrder } from 'core/order/duck';

// own
import Styles from './styles.m.css';
//
// const mapStateToProps = (state, props) => {
//     return {
//         order: {
//             status:   state.order.order.status,
//             num:      state.order.order.num,
//             datetime: state.order.order.datetime,
//         },
//     };
// };

// @connect(mapStateToProps, { fetchOrder })
export class OrderForm extends Component {
    // componentDidMount() {
    //     console.log('PROPS', this.props);
    //     this.props.fetchOrder(this.props.match.params.id);
    // }

    render() {
        return <div>Order Form!</div>;
    }
}

// const OrderContext = React.createContext();
//
// class OrderProvider extends Component {
//     state = {
//         datetime,
//         status,
//         num,
//     };
//
//     render() {
//         return (
//             <OrderContext.Provider value={ { state: this.state } }>
//                 { this.props.children }
//             </OrderContext.Provider>
//         );
//     }
// }
//
// <OrderContext.Consumer>
//         { context => {
//         <p>blalba</p>;
//     } }
//     </OrderContext.Consumer>;
