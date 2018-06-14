// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon, message } from 'antd';

// proj
import book from 'routes/book';
import { fetchAPI } from 'utils';

// own
import Styles from './styles.m.css';

class ReportsDropdown extends React.Component {
    onClick({ key }) {
        console.log('key', key);
        message.info(`Click on item ${key}`);
    }

    render() {
        // const printAct = {
        //     name: '',
        //     link: `${book.reports}${reportType}/${id}`,
        // };

        const menu = (
            <Menu onClick={ key => this.onClick(key) }>
                { this.props.reports.map((item, i) => (
                    <Menu.Item key={ `${i}-${item.name}` }>
                        { /* { console.log('item link', item.link) } */ }
                        <div
                            className={ `${Styles.item} ${item.disabled &&
                                Styles.itemDisabled}` }
                            // to={ item.link }
                            // onClick={ () => fetchAPI('GET', item.link) }
                            // target='_blank'
                            onClick={ () => item.link() }
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
