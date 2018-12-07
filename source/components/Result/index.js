// vendor
import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';

// own
import Styles from './styles.m.css';

export default function Result({
    className,
    type,
    title,
    description,
    extra,
    actions,
    ...restProps
}) {
    const iconMap = {
        error:   <Icon className={ Styles.error } type='close-circle' />,
        success: <Icon className={ Styles.success } type='check-circle' />,
    };
    const clsString = classNames(Styles.result, className);

    return (
        <div className={ clsString } { ...restProps }>
            <div className={ Styles.icon }>{ iconMap[ type ] }</div>
            <div className={ Styles.title }>{ title }</div>
            { description && (
                <div className={ Styles.description }>{ description }</div>
            ) }
            { extra && <div className={ Styles.extra }>{ extra }</div> }
            { actions && <div className={ Styles.actions }>{ actions }</div> }
        </div>
    );
}
