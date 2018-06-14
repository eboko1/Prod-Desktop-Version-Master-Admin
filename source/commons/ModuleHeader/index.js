// vendor
import React, { Component } from 'react';

// own
import Styles from './styles.m.css';

export default class ModuleHeader extends Component {
    render() {
        const { title, description, controls, collapsed } = this.props;

        return (
            <div
                className={ `${Styles.header} ${collapsed &&
                    Styles.headerCollapsed}` }
            >
                <div className={ Styles.headerInfo }>
                    <h1 className={ Styles.title }>{ title }</h1>
                    { description && (
                        <span className={ Styles.description }>
                            { description }
                        </span>
                    ) }
                </div>
                <div className={ Styles.headerContorls }>{ controls }</div>
            </div>
        );
    }
}
