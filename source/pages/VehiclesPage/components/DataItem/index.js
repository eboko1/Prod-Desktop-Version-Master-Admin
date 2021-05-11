//vendor
import React from 'react';

//proj

//own
import Styles from './styles.m.css';

export default class DataItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {
            children,
            label,
        } = this.props;

        return (
            <div className={Styles.container}>
                <div className={Styles.label}>
                    {label}
                </div>

                <div className={Styles.content}>
                    {children}
                </div>
            </div>
        );
    }
}