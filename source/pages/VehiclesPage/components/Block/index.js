//vendor
import React from 'react';

//proj

//own
import Styles from './styles.m.css';

export default class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {
            children,
            title,
            controls
        } = this.props;

        return (
            <div className={Styles.block}>
                <div className={Styles.header}>
                    <div className={Styles.title}>{title}</div>
                    <div className={Styles.controls}>{controls}</div>
                </div>

                <div className={Styles.content}>
                    {children}
                </div>
            </div>
        );
    }
}