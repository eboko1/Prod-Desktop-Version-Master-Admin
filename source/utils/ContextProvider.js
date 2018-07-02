import React, { Component } from 'react';

const Context = React.createContext();

export default class ContextProvider extends Component {
    state = {};

    render() {
        return (
            <Context.Provider value={ this.state }>
                { this.props.children }
            </Context.Provider>
        );
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
