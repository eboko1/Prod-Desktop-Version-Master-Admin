// vendor
import React from 'react';
import MediaQuery from 'react-responsive';

import { _breakpoints } from './breakpoints';
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
