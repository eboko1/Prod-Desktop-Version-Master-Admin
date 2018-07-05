// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Icon } from 'antd';
import _ from 'lodash';

// proj
// import book from 'routes/book';

// own
// import Styles from './styles.m.css';
const Item = Menu.Item;

class ChangeStatusDropdown extends React.Component {
    render() {
        // const { orderStatus } = this.props;
        const orderStatus = 'progress';
        console.log('→ ', orderStatus);
        console.log('→ onStatusChange', this.props.onStatusChange);

        const getMenuItems = () => {
            // const { orderStatus } = props;
            // if (!orderStatus) {
            //     return [];
            // }

            const changeToRequired = {
                status: 'required',
                name:   'required',
                icon:   'question-circle-o',
                action: () => this.props.onStatusChange('required'),
            };

            const changeToReserve = {
                status: 'reserve',
                name:   'reserve',
                icon:   'lock',
                action: () => this.props.onStatusChange('reserve'),
            };

            const changeToNotComplete = {
                status: 'not_complete',
                name:   'not_complete',
                icon:   'plus-square-o',
                action: () => this.props.onStatusChange('not_complete'),
            };

            const changeToApprove = {
                status: 'approve',
                name:   'approve',
                icon:   'safety',
                action: () => this.props.onStatusChange('approve'),
            };

            const changeToProgress = {
                status: 'progress',
                name:   'progress',
                icon:   'car',
                action: () => this.props.onStatusChange('progress'),
            };

            const changeToSuccess = {
                status: 'success',
                name:   'success',
                icon:   'check',
                action: () => this.props.onStatusChange('success'),
            };

            let statuses = [ changeToReserve, changeToRequired, changeToNotComplete, changeToApprove, changeToProgress, changeToSuccess ];

            const appointments = [ 'required', 'not_complete' ];

            const approves = [ 'reserve', 'approve' ];

            const statusesChain = [[ 'call', 'invite' ], appointments, approves, 'progress', 'success' ];
            const statusIndex = _.findIndex(
                statusesChain,
                elem =>
                    _.isArray(elem) ? elem.includes(status) : elem === status,
            );
            // was 1 ~
            const suggestStatus = ~statusIndex
                ? _.flatten(statusesChain.slice(statusIndex + 1))
                : [];

            const additionalStatuses = appointments.includes(status)
                ? appointments.filter(
                    appointmentStatus => appointmentStatus !== status,
                )
                : [];

            const allStatuses = [ ...suggestStatus, ...additionalStatuses ];

            statuses = statuses.map(item =>
                Object.assign({}, item, {
                    disabled: !allStatuses.includes(item.status),
                }));
            console.log('→ orderStatus', orderStatus);
            const menuItems = statuses[ orderStatus ].map(({ name, icon }) => ({
                name,
                icon,
            }));

            return menuItems;
        };

        const menuItems = getMenuItems();
        console.log('→ menuItems', menuItems);

        const menu = (
            <Menu>
                { console.log('→ this.statuses.map', menuItems.map) }
                { menuItems.map((item, index) => (
                    <Item
                        key={ `${index}-${item.name}` }
                        disabled={ item.disabled }
                        onClick={ () => item.action() }
                    >
                        { item.icon && <Icon type={ item.icon } /> }
                        <FormattedMessage id={ item.name } />
                    </Item>
                )) }
            </Menu>
        );

        return (
            <Dropdown overlay={ menu }>
                <Icon type='swap' />
            </Dropdown>
        );
    }
}

export default ChangeStatusDropdown;
