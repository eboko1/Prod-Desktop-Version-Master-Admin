// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Avatar } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import book from 'routes/book';

// own
import Styles from './styles.m.css';

export default class HeaderMenu extends Component {
    render() {
        const { isMobile } = this.props;
        const headerPanel = this._renderHeaderPanel();
        const openYourSite = this._renderOpenYourSite();

        return (
            <div className={ Styles.headerMenu }>
                { !isMobile && openYourSite }
                { headerPanel }
            </div>
        );
    }

    _renderHeaderPanel = () => {
        const { logout, isMobile } = this.props;

        return (
            <div
                className={ `${Styles.headerPanel} ${isMobile &&
                    Styles.headerPanelMobile} ` }
            >
                <Link className={ Styles.user } to={ book.profile }>
                    <Avatar className={ Styles.avatar } icon='user' />
                    <div>СТО Партнер</div>
                </Link>
                <Icon
                    className={ Styles.logout }
                    type='poweroff'
                    onClick={ logout }
                />
            </div>
        );
    };

    _renderOpenYourSite = () => {
        return (
            <div className={ Styles.headerWeb }>
                <a href='#' className={ Styles.headerWebLink }>
                    <Icon type='global' className={ Styles.siteIcon } />
                    <FormattedMessage id='header.open_your_site' />
                </a>
            </div>
        );
    };
}
