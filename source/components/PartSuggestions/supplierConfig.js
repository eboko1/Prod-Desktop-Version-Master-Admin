// vendor
import React from 'react';

// proj
import { images } from 'utils';

// own
import Styles from './styles.m.css';

// const suppliersList = Object.freeze({
//     KYB: {
//         id:   85,
//         name: 'kyb',
//     },
//     SIDEM: {
//         id:   135,
//         name: 'sidem',
//     },
// });

const supplierLink = (supplierName, url) => (
    <a target='_blank' rel='noopener noreferrer' href={ url }>
        <img
            className={ Styles.logo }
            src={ images[ `${supplierName}Logo` ] }
            alt={ supplierName }
        />
    </a>
);

export const getSupplier = (supplierId, partNumber) => {
    switch (supplierId) {
        // KYB
        case 85:
            return supplierLink('kyb', 'http://kyb-europe.com/rus/katalog/');
        // Sidem
        case 135:
            return supplierLink(
                'sidem',
                `https://catalogus.sidem.be/details.asp?sidid=${partNumber}`,
            );
        // Luk
        case 6:
            return supplierLink(
                'luk',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
        case 204:
            return supplierLink(
                'ina',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
        case 192:
            return supplierLink(
                'fag',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
        case 33:
            return supplierLink(
                'gates',
                `https://www.gatesautocat.com/article/${partNumber}`,
            );
        // ecat as default
        default:
            return supplierLink(
                'ecat',
                `https://maxi.ecat.ua/products/search/${partNumber}/type:article+customerNo:none`,
            );
    }
};
