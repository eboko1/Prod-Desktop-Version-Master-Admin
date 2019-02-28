// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Icon, Avatar, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

// proj
import { selectAdmin, selectState } from "core/auth/duck";
import { setBusiness } from "core/forms/switchBusinessForm/duck";
import { setModal, MODALS } from "core/modals/duck";

import { Loader } from "commons";
import { SwitchBusinessModal } from "modals";
import book from "routes/book";

// own
import { Subscriptions } from "./Subscriptions.js";
import { Banner } from "./Banner.js";
import Styles from "./styles.m.css";

const mapStateToProps = state => {
    return {
        isAdmin: selectAdmin(state),
        businessSynonym: selectState(state).businessSynonym,
        headerFetching: state.ui.headerFetching,
    };
};

const mapDispatch = {
    setBusiness,
    setModal,
};

@connect(
    mapStateToProps,
    mapDispatch,
)
export default class HeaderMenu extends Component {
    render() {
        const { isMobile, header, headerFetching } = this.props;
        const headerPanel = this._renderHeaderPanel();
        const openYourSite = this._renderOpenYourSite();

        return (
            <div className={Styles.headerMenu}>
                {!isMobile && openYourSite}
                {headerFetching ? (
                    <Loader
                        loading={headerFetching}
                        background="var(--blocks)"
                    />
                ) : (
                    <>
                        {!_.isEmpty(header.proBanners) && (
                            <Banner banners={header.proBanners} />
                        )}
                        <Subscriptions
                            packages={header.rolePackage}
                            suggestions={header.suggestionGroup}
                        />
                    </>
                )}
                {headerPanel}
            </div>
        );
    }

    _renderHeaderPanel = () => {
        const { logout, isMobile, user } = this.props;

        return (
            <div
                className={`${Styles.headerPanel} ${isMobile &&
                    Styles.headerPanelMobile} `}
            >
                <Tooltip
                    placement="topLeft"
                    title={<FormattedMessage id="header.profile" />}
                >
                    <Link className={Styles.user} to={book.profile}>
                        <Avatar className={Styles.avatar} icon="user" />
                        <span className={Styles.userName}>
                            {user.name} {user.surname}
                        </span>
                    </Link>
                </Tooltip>
                <Tooltip
                    placement="topLeft"
                    title={<FormattedMessage id="header.logout" />}
                >
                    <Icon
                        className={Styles.logout}
                        type="poweroff"
                        onClick={logout}
                    />
                </Tooltip>
                <SwitchBusinessModal setBusiness={this.props.setBusiness} />
            </div>
        );
    };

    _renderOpenYourSite = () => {
        const {
            isAdmin,
            setModal,
            businessSynonym,
            user: { businessesAccess },
        } = this.props;

        return (
            <div className={Styles.headerWeb}>
                {(isAdmin || businessesAccess) && (
                    <Tooltip
                        placement="topLeft"
                        title={<FormattedMessage id="header.switch_business" />}
                    >
                        <Icon
                            type="home"
                            className={Styles.homeIcon}
                            onClick={() => setModal(MODALS.SWITCH_BUSINESS)}
                        />
                    </Tooltip>
                )}
                <Tooltip
                    placement="topLeft"
                    title={<FormattedMessage id="header.open_your_site" />}
                >
                    <a
                        href={`https://${businessSynonym}.cb24.eu`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={Styles.headerWebLink}
                    >
                        <Icon type="global" className={Styles.siteIcon} />
                    </a>
                </Tooltip>
            </div>
        );
    };
}
