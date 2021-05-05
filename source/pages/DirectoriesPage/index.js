// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import book from 'routes/book';
import {permissions, isForbidden} from 'utils';
// own
import Styles from './styles.m.css';

const struct = [
    {
        blockTitle: 'directories.popular',
        items: [
            {
                itemName:  'navigation.products',
                disabled:  false,
                link:      book.products,
            },
            {
                itemName:  'navigation.vehicles',
                disabled:  false,
                link:      book.vehicles,
            },
            {
                itemName:  'navigation.client_hot_operations',
                disabled:  false,
                link:      book.clientHotOperations,
            },
            {
                itemName:  'navigation.employees',
                disabled:  false,
                link:      book.employeesPage,
            },
        ],
    },
    {
        blockTitle: 'directories.counterparties',
        items: [
            {
                itemName:  'navigation.vehicles',
                disabled:  false,
                link:      book.vehicles,
            },
            {
                itemName:  'navigation.client_hot_operations',
                disabled:  false,
                link:      book.client_hot_operations,
            },
            {
                itemName:  'navigation.employees',
                disabled:  false,
                link:      book.employeesPage,
            },
            {
                itemName:  'navigation.suppliers',
                disabled:  false,
                link:      book.suppliersPage,
            },
        ],
    },
    {
        blockTitle: 'navigation.products',
        items: [
            {
                itemName:  'navigation.products',
                disabled:  false,
                link:      book.products,
            },
            {
                itemName:  'navigation.products_groups',
                disabled:  false,
                link:      book.productsGroups,
            },
            {
                itemName:  'navigation.price_groups',
                disabled:  false,
                link:      book.priceGroups,
            },
            {
                itemName:  'navigation.related_groups',
                disabled:  true,
                link:      book.relatedGroups,
            },
            {
                itemName:  'navigation.warehouses',
                disabled:  false,
                link:      book.warehouses,
            },
            {
                itemName:  'wms.cells',
                disabled:  false,
                link:      book.wms,
            },
            {
                itemName:  'navigation.units',
                disabled:  true,
                link:      book.units,
            },
        ],
    },
    {
        blockTitle: 'directories.orders',
        items: [
            {
                itemName:  'navigation.labors_page',
                disabled:  false,
                link:      book.laborsPage,
            },
            {
                itemName:  'navigation.norm_hours',
                disabled:  true,
                link:      book.norm_hours,
            },
            {
                itemName:  'navigation.complexes',
                disabled:  true,
                link:      book.complexes,
            },
            {
                itemName:  'navigation.related_labors',
                disabled:  true,
                link:      book.relatedLabors,
            },
            {
                itemName:  'navigation.repair_map',
                disabled:  false,
                link:      book.repairMapSetting,
            },
            {
                itemName:  'navigation.statuses',
                disabled:  false,
                link:      book.statuses,
            },
            {
                itemName:  'navigation.locations_settings',
                disabled:  false,
                link:      book.locationSettings,
            },
            {
                itemName:  'navigation.diagnostic_patterns',
                disabled:  false,
                link:      book.diagnosticPatterns,
            },
        ],
    },
    {
        blockTitle: 'navigation.accounting',
        items: [
            {
                itemName:  'navigation.cash_settings',
                disabled:  false,
                link:      book.cashSettingsPage,
            },
            {
                itemName:  'navigation.requisites',
                disabled:  false,
                link:      book.requisites,
            },
            {
                itemName:  'navigation.report_analytics',
                disabled:  false,
                link:      book.analytics,
            },
        ],
    },
    {
        blockTitle: 'directories.general_settings',
        items: [
            {
                itemName:  'navigation.main_settings',
                disabled:  false,
                link:      book.oldApp.settings,
            },
            {
                itemName:  'navigation.posts',
                disabled:  false,
                link:      book.oldApp.controlPanel,
            },
            {
                itemName:  'navigation.cb24',
                disabled:  false,
                link:      book.oldApp.links,
            },
            {
                itemName:  'navigation.availabilities',
                disabled:  true,
                link:      book.availabilitiesPage,
            },
        ],
    },
];

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@connect(
    mapStateToProps,
    void 0,
)
export default class DirectoriesPage extends Component {
    constructor(props) {
        super(props);
    }

    _renderBlock = ({blockTitle, items}, key) => {
        return (
            <div key={ key } className={ Styles.block }>
                <div className={ Styles.blockTitle }>
                    <FormattedMessage id={blockTitle} />
                </div>
                <div className={ Styles.blockItems}>
                    {items.map((item, key)=>(
                        this._renderItem(blockTitle, item, key)
                    ))}
                </div>
            </div>
        )
    };

    _renderItem = (blockTitle, {itemName, link, disabled}, key) => {
        return (
            <div key={ key } className={ disabled ? Styles.disabledItem + " " + Styles.item : Styles.item }>
                <Link
                    className={Styles.buttonLink}
                    to={ {
                        pathname: link,
                    } }
                >
                    <Button className={Styles.itemButton}>
                        <FormattedMessage id={itemName} />
                    </Button>
                </Link>
            </div>
        )
    };


    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.directories' /> }
                description={ <FormattedMessage id='directories.description' /> }
            >
                {struct.map((block, key)=>(
                    this._renderBlock(block, key)
                ))}
            </Layout>
        );
    }
}
