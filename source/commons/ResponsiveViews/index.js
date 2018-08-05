// vendor
import React from 'react';
import MediaQuery from 'react-responsive';

// antd breakpoints
export const BREAKPOINTS = {
    xs: {
        min: null,
        max: 575,
    },
    sm: {
        min: 576,
        max: 767,
    },
    md: {
        min: 768,
        max: 991,
    },
    lg: {
        min: 992,
        max: 1199,
    },
    xl: {
        min: 1200,
        max: 1599,
    },
    xxl: {
        min: 1600,
        max: null,
    },
};

// custom breakpoints
const _breakpoints = {
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

// <MediaQuery/> factory
const _breakpoint = (view, children, component) => {
    const breakpoint = _breakpoints[ view ] || view;

    return (
        <MediaQuery
            minWidth={ breakpoint.min }
            maxWidth={ breakpoint.max }
            component={ component }
        >
            { children }
        </MediaQuery>
    );
};

// views collection
export const ResponsiveView = props => {
    // ? props.view : { min: null, max: null },
    return _breakpoint(props.view, props.children, props.component);
};

export const MobileView = props =>
    _breakpoint('mobile', props.children, props.component);

export const TabletView = props =>
    _breakpoint('tablet', props.children, props.component);

export const DesktopView = props =>
    _breakpoint('desktop', props.children, props.component);
