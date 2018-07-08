// vendor
import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';

// own
import Styles from './styles.m.css';

export default class CallStatusIcon extends Component {
    getStatusIcon(status) {
        switch (status) {
            case 'NO ANSWER':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='call_status_icon.no_answer' />
                        }
                        overlayStyle={ { zIndex: 110 } }
                    >
                        <Icon
                            type='close-square'
                            className={ `${Styles.icon} ${Styles.noAnswer}` }
                        />
                    </Tooltip>
                );

            default:
                return (
                    <Tooltip
                        placement='top'
                        title={ <FormattedMessage id='call_status_icon.call' /> }
                        overlayStyle={ { zIndex: 110 } }
                    >
                        <Icon
                            type='phone'
                            className={ `${Styles.icon} ${Styles.phone}` }
                        />
                    </Tooltip>
                );
        }
    }

    render() {
        return this.getStatusIcon(this.props.status);
    }
}
