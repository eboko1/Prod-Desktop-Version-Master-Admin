import React, { Component } from 'react';
import { Steps, Icon } from 'antd';

import Styles from './styles.m.css';
import './arrowNav.css';
const Step = Steps.Step;

export default class ArrowsNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }
    _goToStep(step) {
        this.setState({ current: step });
    }

    _setIcon(steps, step) {
        if (step === steps.length - 1) {
            return <Icon type='close-circle-o' />;
        } else if (step === steps.length - 2) {
            return <Icon type='database' />;
        }

        return null;
    }

    render() {
        const { steps } = this.props;
        const { current } = this.state;

        return (
            <div>
                <Steps className={ Styles.steps } current={ current }>
                    { steps.map((item, index) => (
                        <Step
                            className={ Styles.step }
                            key={ item.title }
                            title={ item.title }
                            onClick={ () => this._goToStep(index) }
                            icon={ this._setIcon(steps, index) }
                            // icon={
                            //     index === steps.length - 1 ? (
                            //         <Icon type='close-circle-o' />
                            //     ) : null
                            // }
                        />
                    )) }
                </Steps>
                <div>{ steps[ this.state.current ].content }</div>
            </div>
        );
    }
}
