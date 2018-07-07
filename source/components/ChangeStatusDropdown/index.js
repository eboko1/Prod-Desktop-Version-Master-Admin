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
        const {
            orderStatus: status,
            onStatusChange,
            setModal,
            modals,
        } = this.props;

        const getMenuItems = () => {
            const changeToRequired = {
                status: 'required',
                name:   'required',
                icon:   'question-circle-o',
                action: () => onStatusChange('required'),
            };

            const changeToReserve = {
                status: 'reserve',
                name:   'reserve',
                icon:   'lock',
                action: () => onStatusChange('reserve'),
            };

            const changeToNotComplete = {
                status: 'not_complete',
                name:   'not_complete',
                icon:   'plus-square-o',
                action: () => onStatusChange('not_complete'),
            };

            const changeToApprove = {
                status: 'approve',
                name:   'approve',
                icon:   'safety',
                action: () => onStatusChange('approve'),
            };

            const changeToProgress = {
                status: 'progress',
                name:   'progress',
                icon:   'car',
                action: () => onStatusChange('progress'),
            };

            const changeToSuccess = {
                name:   'success',
                status: 'success',
                icon:   'check',
                action: () => setModal(modals.TO_SUCCESS),
            };

            const statuses = [ changeToReserve, changeToRequired, changeToNotComplete, changeToApprove, changeToProgress, changeToSuccess ];
            const appointments = [ 'required', 'not_complete' ];
            const approves = [ 'approve', 'reserve' ];
            const statusesChain = [[ 'call', 'invite' ], appointments, approves, 'progress', 'success' ];

            const statusIndex = _.findIndex(
                statusesChain,
                elem =>
                    _.isArray(elem) ? elem.includes(status) : elem === status,
            );

            const suggestStatus = ~statusIndex
                ? _.flatten(statusesChain.slice(statusIndex + 1))
                : [];

            const additionalStatuses = appointments.includes(status)
                ? appointments.filter(
                    appointmentStatus => appointmentStatus !== status,
                )
                : [];

            const allStatuses = [ ...suggestStatus, ...additionalStatuses ];

            const menuItems = statuses
                .filter(({ status }) => allStatuses.includes(status))
                .map(({ name, icon, action }) => ({
                    name,
                    icon,
                    action,
                }));

            return menuItems;
        };

        const menuItems = getMenuItems();

        const menu = (
            <Menu>
                { menuItems.map((item, index) => (
                    <Item
                        key={ `${index}-${item.name}` }
                        disabled={ item.disabled }
                        onClick={ () => item.action() }
                    >
                        { item.icon && (
                            <Icon
                                type={ item.icon }
                                style={ {
                                    fontSize: 18,
                                    margin:   '0 10px 0 0',
                                } }
                            />
                        ) }
                        <FormattedMessage id={ item.name } />
                    </Item>
                )) }
            </Menu>
        );

        return menuItems.length ? (
            <Dropdown overlay={ menu }>
                <div
                    style={ {
                        cursor: 'pointer',
                        margin: '0 10px',
                    } }
                >
                    <Icon
                        type='swap'
                        style={ {
                            fontSize: 24,
                        } }
                    />
                    Перевести в статус
                </div>
            </Dropdown>
        ) : null;
    }
}

export default ChangeStatusDropdown;
