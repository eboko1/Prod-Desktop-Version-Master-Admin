// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';

// proj
import { Catcher, Spinner } from 'commons';
import { NewPasswordForm } from 'forms';

// own
import Styles from '../LoginPage/styles.m.css';

const mapStateToProps = state => ({
    spinner: state.ui.authFetching,
});

@connect(mapStateToProps)
export default class NewPasswordPage extends Component {
    render() {
        return !this.props.spinner ? (
            <Catcher>
                <section className={ Styles.loginPage }>
                    <NewPasswordForm />
                </section>
            </Catcher>
        ) : (
            <Spinner spin={ this.props.spinner } />
        );
    }
}
