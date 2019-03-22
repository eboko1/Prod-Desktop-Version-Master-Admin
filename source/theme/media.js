// vendor
import { css } from 'styled-components';

// own
import { BREAKPOINTS } from 'utils';

// iterate through the sizes and create a media template
export const media = Object.keys(BREAKPOINTS).reduce((acc, label) => {
    const minSize = BREAKPOINTS[ label ].min;
    const maxSize = BREAKPOINTS[ label ].max;
    acc[ label ] = (...args) => css`
        @media ${minSize && `(min-width: ${minSize}px)`} ${minSize &&
        maxSize &&
        'and'} ${maxSize && `(max-width: ${maxSize}px)`} {${css(...args)};
        }
    `;

    return acc;
}, {});

// @media (min-width: ${minSize}px) and (max-width: ${maxSize}px) {
