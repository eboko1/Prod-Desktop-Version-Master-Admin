// vendor
import React from 'react';

export const Banner = ({ banners }) => {
    return (
        <img style={ { margin: '0 24px'} } src={ banners[ Math.floor(Math.random() * banners.length) ].url } />
    );
};
