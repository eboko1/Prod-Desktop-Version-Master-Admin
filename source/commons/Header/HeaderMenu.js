// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Avatar } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { selectAdmin } from 'core/auth/duck';
import { setBusiness } from 'core/forms/switchBusinessForm/duck'
import { setModal, MODALS } from 'core/modals/duck';

import { SwitchBusinessModal } from 'modals';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        isAdmin: selectAdmin(state),
    };
};

const mapDispatch = {
    setBusiness,
    setModal,
};

@connect(mapStateToProps, mapDispatch)
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
        const { logout, isMobile, user } = this.props;

        return (
            <div
                className={ `${Styles.headerPanel} ${isMobile &&
                    Styles.headerPanelMobile} ` }
            >
                <Link className={ Styles.user } to={ book.profile }>
                    <Avatar className={ Styles.avatar } icon='user' />
                    { user.name } { user.surname }
                </Link>
                <Icon
                    className={ Styles.logout }
                    type='poweroff'
                    onClick={ logout }
                />
                <SwitchBusinessModal
                    setBusiness={ this.props.setBusiness }
                />
            </div>
        );
    };

    _renderOpenYourSite = () => {
        const { isAdmin, setModal } = this.props;

        return (
            <div className={ Styles.headerWeb }>
                { isAdmin && (
                    <Icon
                        type='home'
                        className={ Styles.homeIcon }
                        onClick={ () => setModal(MODALS.SWITCH_BUSINESS) }
                    />
                ) }
                <a href='#' className={ Styles.headerWebLink }>
                    <Icon type='global' className={ Styles.siteIcon } />
                    <FormattedMessage id='header.open_your_site' />
                </a>
            </div>
        );
    };
}
