// vendor
import React, { Component } from 'react';
import withSizes from 'react-sizes';

// proj
import { getDisplayName, _breakpoints } from 'utils';

export const withResponsive = () => Enhanceable => {
    const mapSizesToProps = ({ width }) => ({
        isMobile: width < _breakpoints.mobile.max,
        isTablet:
            _breakpoints.tablet.min <= width &&
            width >= _breakpoints.tablet.max,
        isDesktop:
            _breakpoints.desktop.min <= width &&
            width >= _breakpoints.desktop.max,
    });

    @withSizes(mapSizesToProps)
    class Enhanced extends Component {
        render() {
            return <Enhanceable { ...this.props } />;
        }
    }

    Enhanced.displayName = `withResponsive(${getDisplayName(Enhanceable)})`;

    return Enhanced;
};
