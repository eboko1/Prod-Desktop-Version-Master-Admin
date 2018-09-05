// vendor
import React, { Component } from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import Styles from './styles.m.css';

export default class Catcher extends Component {
    state = {
        error:     null,
        errorInfo: null,
    };

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("🔥_ERROR_🔥:", error); // eslint-disable-line
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (error) {
            return (
                <section className={ Styles.catcher }>
                    <FormattedMessage id='error'/>!
                    <Icon className={ Styles.catcherIcon } type='frown-o' />
                </section>
            );
        }

        return children;
    }
}
