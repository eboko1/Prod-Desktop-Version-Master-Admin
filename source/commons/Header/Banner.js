// vendor
import React, { memo } from 'react';

export const Banner = memo(({ banners }) => {
    return (
        <img
            style={ { margin: '0 24px' } }
            src={ banners[ Math.floor(Math.random() * banners.length) ].url }
        />
    );
});
