// vendor
import React from 'react';
import MediaQuery from 'react-responsive';

// antd breakpoints
//
// xs:  '(min-width: null) and (max-width: 575px)',
// sm:  '(min-width: 576px) and (max-width: 767px)',
// md:  '(min-width: 768px) and (max-width: 991px)',
// lg:  '(min-width: 768px) and (max-width: 991px)',
// xl:  '(min-width: 992px) and (max-width: 1199px)',
// xxl: '(min-width: 1600px) and (max-width: null)',
//

const breakpoints = {
    mobile: {
        min: null,
        max: 767,
    },
    tablet: {
        min: 768,
        max: 1199,
    },
    desktop: {
        min: 1200,
        max: null,
    },
};

const _breakpoint = (view, content, component) => {
    const breakpoint = breakpoints[ view ] || breakpoints.desktop;

    return (
        <MediaQuery
            minWidth={ breakpoint.min }
            maxWidth={ breakpoint.max }
            component={ component }
        >
            { content }
        </MediaQuery>
    );
};

export const MobileView = props =>
    _breakpoint('mobile', props.children, props.component);

export const TabletView = props =>
    _breakpoint('tablet', props.children, props.component);

export const DesktopView = props =>
    _breakpoint('desktop', props.children, props.component);
