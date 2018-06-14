// Core
import React, { Component } from 'react';
import { Button } from 'antd';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import { formsActions } from 'core/forms/actions';

import { Layout } from 'commons';
import { RequestForm } from 'forms';
//
// const mapStateToProps = state => {
//     return {
//         email: state.email,
//     };
// };
//
// const mapDispatchToProps = dispatch => {
//     return {
//         actions: bindActionCreators(
//             {
//                 setEmail:    formsActions.setEmail,
//                 setUsername: formsActions.setUsername,
//             },
//             dispatch,
//         ),
//     };
// };

// @connect(mapStateToProps, mapDispatchToProps)
class Request extends Component {
    // _submitRequest = email => this.props.actions.setEmail(email);
    // _setUsername = username => this.props.actions.setUsername(username);

    render() {
        return (
            <Layout
                title='Работа над запросом RQ-847-1001'
                description='Отослан: 7 марта 2018г., 11:02'
                controls={
                    <>
                        <Button onClick={ () => this._setUsername() }>
                            Username
                        </Button>
                        <Button
                            type='primary'
                            onClick={ () => this._submitRequest('email@ex.com') }
                        >
                            Submit
                        </Button>
                    </>
                }
            >
                <RequestForm />
            </Layout>
        );
    }
}

export default Request;

// Out = connect(state => {
//     return {
//         email: state.form.email,
//     };
// })(Out);
