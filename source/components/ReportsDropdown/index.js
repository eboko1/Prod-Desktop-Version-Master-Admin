// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon, message } from 'antd';
import { saveAs } from 'file-saver'

// proj
import book from 'routes/book';
import { fetchAPI } from 'utils';

// own
import Styles from './styles.m.css';

class ReportsDropdown extends React.Component {
    render() {

        const menu = (
            <Menu>
                { this.props.reports.map((item, i) => (
                    <Menu.Item key={ `${i}-${item.name}` }>
                        <div
                            className={ `${Styles.item} ${item.disabled &&
                                Styles.itemDisabled}` }
                            onClick={
                                async () => {
                                    const reportFile = await fetchAPI('GET', item.link, null, null, true);
                                    saveAs(reportFile, `${item.name} for order ${this.props.orderId}`);
                                }
                            }
                        >
                            { item.icon && <Icon type={ item.icon } /> }
                            { item.name }
                        </div>
                    </Menu.Item>
                )) }
            </Menu>
        );

        return (
            <Dropdown overlay={ menu }>
                { /* <a className='ant-dropdown-link' href='#'> */ }
                <Icon type='printer' />
                { /* </a> */ }
            </Dropdown>
        );
    }
}

export default ReportsDropdown;
