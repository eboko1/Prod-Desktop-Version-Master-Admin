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
            className
        } = this.props;

        return (
            <div className={[Styles.container, className].join(" ")}>
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