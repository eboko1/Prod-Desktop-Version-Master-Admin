// vendor
import React from 'react';

// proj
import { images } from 'utils';

// own
import Styles from './styles.m.css';

const suppliersList = Object.freeze({
    KYB: {
        id:   85,
        name: 'kyb',
    },
    SIDEM: {
        id:   135,
        name: 'sidem',
    },
});

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
        case suppliersList.KYB.id:
            supplierLink(
                suppliersList.KYB.name,
                'http://kyb-europe.com/rus/katalog/',
            );
            break;
        // Sidem
        case suppliersList.SIDEM.id:
            supplierLink(
                suppliersList.SIDEM.sidem,
                `https://catalogus.sidem.be/details.asp?sidid=${partNumber}`,
            );
            break;
        // Luk
        case 6:
            supplierLink(
                'luk',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
            break;
        case 204:
            supplierLink(
                'ina',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
            break;
        case 192:
            supplierLink(
                'fag',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
            break;
        case 33:
            supplierLink(
                'gates',
                `https://www.gatesautocat.com/article/${partNumber}`,
            );
            break;
        // ecat as default
        default:
            supplierLink(
                'ecat',
                `https://maxi.ecat.ua/products/search/${partNumber}/type:article+customerNo:none`,
            );
            break;
    }
};
