// core
import React, { Component } from 'react';
import { Button, Icon, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import book from 'routes/book';

// own
import Styles from './styles.m.css';

class Header extends Component {
    render() {
        const { className, collapsed, toggleNavigation, logout } = this.props;

        return (
            <header
                className={ `${Styles.header} ${className} ${collapsed &&
                    Styles.headerCollapsed}` }
            >
                <div className={ Styles.headerWrapper }>
                    <Icon
                        className={ Styles.trigger }
                        type={ collapsed ? 'menu-unfold' : 'menu-fold' }
                        onClick={ toggleNavigation }
                    />
                    <div className={ Styles.headerWeb }>
                        <a href='#' className={ Styles.headerWebLink }>
                            <Icon type='global' className={ Styles.siteIcon } />
                            <FormattedMessage id='header.open_your_site' />
                        </a>
                    </div>
                    <div className={ Styles.headerPanel }>
                        <Link className={ Styles.user } to={ book.profile }>
                            <Avatar className={ Styles.avatar } icon='user' />
                            <div>СТО Партнер</div>
                        </Link>
                        <Icon
                            className={ Styles.logout }
                            type='poweroff'
                            onClick={ () => logout() }
                        />
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
