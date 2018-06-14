import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router';
import { hot } from 'react-hot-loader';
// proj
import { authActions } from 'core/auth/actions';
import { uiActions } from 'core/ui/actions';

import { Spinner, Catcher } from 'commons';
import { Exception } from 'containers';
// own
import book from './book';
import Private from './Private';
import Public from './Public';

import { getToken } from 'utils';

@withRouter
@hot(module)
export default class Routes extends Component {
    // state = {token: ''};
    //
    // static getDerivedStateFromProps(props) {
    //     const token = getToken();
    //     console.log(token);
    //     if (token) {
    //         if (props.location.pathname === book.login) {
    //             props.history.replace(book.distributorDash);
    //         }
    //     }
    //
    //     return {token};
    // }

    shouldComponentUpdate(nextProps) {
        return nextProps.location !== this.props.location;
    }

    render() {
        return (
            <Catcher>
                <Switch>
                    { !getToken() && <Public /> }
                    <Private />
                    <Route path={ book.exception } component={ Exception } />
                </Switch>
            </Catcher>
        );
    }
}
