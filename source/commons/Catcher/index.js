// vendor
import React, { Component } from 'react';
import { Icon } from 'antd';

// proj
import Styles from './styles.m.css';

export default class Catcher extends Component {
    state = {
        error: false,
    };

    componentDidCatch(error, stack) {
        console.log("ERROR:", error.message); // eslint-disable-line
        console.log("STACKTRACE:", stack.componentStack); // eslint-disable-line

        this.setState(() => ({
            error: true,
        }));
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (error) {
            return (
                <section className={ Styles.catcher }>
                    <span>
                        Error!
                        <Icon className={ Styles.catcherIcon } type='frown-o' />
                    </span>
                    { /* <span>Props</span>
                    <pre>{ JSON.stringify(this.props, null, 2) }</pre> */ }
                </section>
            );
        }

        return children;
    }
}
