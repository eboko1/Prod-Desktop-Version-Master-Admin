// vendro
import 'rc-drawer/assets/index.css';
import React from 'react';
import DrawerMenu from 'rc-drawer';

// own
import SiderMenu from './SiderMenu';

const Navigation = props => {
    const { isMobile, collapsed } = props;

    return isMobile ? (
        <DrawerMenu
            getContainer={ null }
            level={ null }
            open={ !collapsed }
            handleChild={ <i className='drawer-handle-icon' /> }
            onHandleClick={ () => props.onCollapse(!collapsed) }
            onMaskClick={ () => props.onCollapse(true) }
        >
            <SiderMenu { ...props } collapsed={ isMobile ? false : collapsed } />
        </DrawerMenu>
    ) : (
        <SiderMenu { ...props } />
    );
};

export default Navigation;
