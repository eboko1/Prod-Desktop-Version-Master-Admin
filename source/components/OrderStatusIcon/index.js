// vendor
import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';

// own
import Styles from './styles.m.css';

export default class OrderStatusIcon extends Component {
    getStatusIcon(status) {
        switch (status) {
            case 'not_complete':
                return (
                    <Tooltip
                        placement='top'
                        title={ <FormattedMessage id='order_status_icon.new' /> }
                    >
                        <Icon
                            type='plus-square-o'
                            className={ `${Styles.icon} ${Styles.notComplete}` }
                        />
                    </Tooltip>
                );
            case 'call':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.a_call' />
                        }
                    >
                        <Icon
                            type='phone'
                            className={ `${Styles.icon} ${Styles.call}` }
                        />
                    </Tooltip>
                );
            case 'required':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.questionable' />
                        }
                    >
                        <Icon
                            type='question-circle-o'
                            className={ `${Styles.icon} ${Styles.required}` }
                        />
                    </Tooltip>
                );

            case 'progress':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.repair' />
                        }
                    >
                        <Icon
                            type='car'
                            className={ `${Styles.icon} ${Styles.progress}` }
                        />
                    </Tooltip>
                );
            case 'approve':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.record' />
                        }
                    >
                        <Icon
                            type='safety'
                            className={ `${Styles.icon} ${Styles.approve}` }
                        />
                    </Tooltip>
                );
            case 'reserve':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.reserve' />
                        }
                    >
                        <Icon
                            type='lock'
                            className={ `${Styles.icon} ${Styles.reserve}` }
                        />
                    </Tooltip>
                );
            case 'success':
                return (
                    <Tooltip
                        placement='top'
                        title={ <FormattedMessage id='order_status_icon.done' /> }
                    >
                        <Icon
                            type='check'
                            className={ `${Styles.icon} ${Styles.success}` }
                        />
                    </Tooltip>
                );
            case 'invite':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.invitation' />
                        }
                    >
                        <Icon
                            type='wechat'
                            className={ `${Styles.icon} ${Styles.invite}` }
                        />
                    </Tooltip>
                );
            case 'cancel':
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.cancel' />
                        }
                    >
                        <Icon
                            type='close-circle'
                            className={ `${Styles.icon} ${Styles.cancel}` }
                        />
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip
                        placement='top'
                        title={
                            <FormattedMessage id='order_status_icon.order' />
                        }
                    >
                        <Icon type='question' />
                    </Tooltip>
                );
        }
    }

    render() {
        return this.getStatusIcon(this.props.status);
    }
}
