// vendor
import React from 'react';

// proj
import { images } from 'utils';

// own
import Styles from './styles.m.css';

const supplierLink = (supplierName, url) => (
    <a target='_blank' rel='noopener noreferrer' href={ url }>
        <img
            className={ Styles.logo }
            src={ images[ `${supplierName}Logo` ] }
            alt={ supplierName }
        />
    </a>
);

/* eslint-disable complexity */
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
        // Ina
        case 204:
            return supplierLink(
                'ina',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
        // Fag
        case 192:
            return supplierLink(
                'fag',
                'https://webcat.schaeffler.com/web/schaeffler/ru_RU/index.xhtml',
            );
        // Gates
        case 33:
            return supplierLink(
                'gates',
                `https://www.gatesautocat.com/article/${partNumber}`,
            );
        // Ferodo
        case 62:
            return supplierLink(
                'ferodo',
                'http://fmecat.eu/index-car.asp?langID=31',
            );
        // Moog
        case 134:
            return supplierLink(
                'moog',
                'http://fmecat.eu/index-car.asp?langID=31',
            );
        // Beru
        case 11:
            return supplierLink(
                'beru',
                'http://fmecat.eu/index-car.asp?langID=31',
            );
        // RoadHouse
        case 152:
            return supplierLink('roadhouse', 'http://roadhouse.es/en/home');
        // Remsa
        case 153:
            return supplierLink('remsa', 'http://www.remsa.com/');
        // Sachs
        case 32:
            return supplierLink(
                'sachs',
                `https://aftermarket.zf.com/go/en/sachs/catalogs/#/search?languageID=4&brandID=32&vehicleTypeIDs=p&countryID=UA&manufacturerID=&modelID=&engineID=&searchText=${String(
                    partNumber,
                ).replace(/\s/g, '%20')}`,
            );
        // Lemfoerder
        case 35:
            return supplierLink(
                'lemfoerder',
                'http://tecapp-portal.tecalliance.net/apps/trw/index.html#/app/home/dashboard',
            );
        // TRW
        case 161:
            return supplierLink(
                'trw',
                `https://www.trwaftermarket.com/en/catalogue/#market=ua&vehicleType=P&partNumber=${partNumber}`,
            );
        // ecat as default
        default:
            return supplierLink(
                'ecat',
                `https://maxi.ecat.ua/products/search/${partNumber}/type:article+customerNo:none`,
            );
    }
};
