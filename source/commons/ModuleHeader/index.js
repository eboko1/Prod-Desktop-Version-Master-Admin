// vendor
import React, { Component } from 'react';
import { Icon, Switch } from "antd";

// proj
import { images } from 'utils';
import { permissions, isForbidden, isAdmin } from 'utils';
import { setTireFittingToken, getTireFittingToken, removeTireFittingToken } from "utils";

// own
import Styles from './styles.m.css';

export default class ModuleHeader extends Component {
    render() {
        const {
            user,
            title,
            description,
            controls,
            collapsed,
            isMobile,
            onCollapse,
        } = this.props;

        return isMobile ? (
            <div
                className={ Styles.headerMobile }
            >   
                <div
                    className={ Styles.carBookHeaderBlock }
                    onClick={()=>{
                        onCollapse(!collapsed)
                    }}
                >
                    <Icon type="menu-unfold" />
                    <img
                        className={ Styles.logo }
                        src={ images.carbookLogoWhite }
                        alt='logo'
                    />
                    {isAdmin(user) &&
                        <Switch
                            style={{
                                marginLeft: 14,
                                backgroundColor: !Boolean(getTireFittingToken()) && "var(--cancel)",
                            }}
                            checked={Boolean(getTireFittingToken())}
                            onChange={(checked)=>{
                                if(checked) setTireFittingToken("666");
                                else removeTireFittingToken();

                                window.location.reload();
                            }}
                        />
                    }
                </div>
                <div
                    className={ Styles.headerMobileTitleBlock }
                >
                    <div className={ Styles.headerInfo }>
                        <h1 className={ Styles.title }>{ title }</h1>
                        { description && (
                            <span className={ Styles.description }>
                                { description }
                            </span>
                        ) }
                    </div>
                    <div className={ Styles.headerContorls }>{ controls }</div>
                </div>
            </div>
        ) : (
            <div
                className={ `${Styles.header} ${collapsed &&
                    Styles.headerCollapsed}` }
            >
                <div className={ Styles.headerInfo }>
                    <h1 className={ Styles.title }>{ title }</h1>
                    { description && (
                        <span className={ Styles.description }>
                            { description }
                        </span>
                    ) }
                </div>
                <div className={ Styles.headerContorls }>{ controls }</div>
            </div>
        );
    }
}
