// vendor
import React, { Component } from 'react';
import { Icon, Switch } from "antd";

// proj
import { images } from 'utils';
import { permissions, isForbidden, isAdmin } from 'utils';

// own
import Styles from './styles.m.css';

export default class ModuleHeader extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showControls: false,
        };
    }

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

        const { showControls } = this.state;

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
                        src={ images.carbookLogo2 }
                        alt='logo'
                    />
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
                    <div className={ Styles.headerContorlsShowIcon }>
                        <Icon
                            type="menu"
                            onClick={()=>this.setState({
                                showControls: !showControls
                            })}
                        />
                    </div>
                    <div className={ Styles.headerContorls }>{ controls }</div>
                </div>
                <div 
                    className={ Styles.hiddenHeaderContorls } 
                    style={{
                        display: showControls ? 'flex' : 'none'
                    }}
                >
                    { controls }
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
