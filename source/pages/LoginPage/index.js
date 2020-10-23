// vendor
import React, { Component } from "react";
import { connect } from "react-redux";

// proj
import { Catcher, Spinner } from "commons";
import { LoginForm } from "forms";

// own
import { withErrorMessage } from "utils";
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    spinner: state.ui.authFetching,
});

@connect(mapStateToProps)
@withErrorMessage()
export default class LoginPage extends Component {
    render() {
        return !this.props.spinner ? (
            <Catcher>
                <section className={Styles.loginPage}>
                    <LoginForm />
                </section>
            </Catcher>
        ) : (
            <Spinner spin={this.props.spinner} />
        );
    }
}
