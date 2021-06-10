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
                color:     'var(--db_approve)'
            },
            {
                itemName:  'navigation.vehicles',
                disabled:  user => isForbidden(user, permissions.GET_CLIENTS),
                link:      book.vehicles,
                color:     'var(--db_approve)'
            },
            {
                itemName:  'navigation.client_hot_operations',
                disabled:  false,
                link:      book.clientHotOperations,
                color:     'var(--db_approve)'
            },
            {
                itemName:  'navigation.employees',
                disabled:  false,
                link:      book.employeesPage,
                color:     'var(--db_approve)'
            },
        ],
    },
    {
        blockTitle: 'directories.counterparties',
        items: [
            {
                itemName:  'navigation.vehicles',
                disabled:  user => isForbidden(user, permissions.GET_CLIENTS),
                link:      book.vehicles,
                color:     'var(--db_progress)'
            },
            {
                itemName:  'navigation.client_hot_operations',
                disabled:  false,
                link:      book.clientHotOperations,
                color:     'var(--db_progress)'
            },
            {
                itemName:  'navigation.employees',
                disabled:  false,
                link:      book.employeesPage,
                color:     'var(--db_progress)'
            },
            {
                itemName:  'navigation.suppliers',
                disabled:  false,
                link:      book.suppliersPage,
                color:     'var(--db_progress)'
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
                color:     'var(--db_reserve)'
            },
            {
                itemName:  'navigation.products_groups',
                disabled:  false,
                link:      book.productsGroups,
                color:     'var(--db_reserve)'
            },
            {
                itemName:  'navigation.price_groups',
                disabled:  false,
                link:      book.priceGroups,
                color:     'var(--db_reserve)'
            },
            {
                itemName:  'navigation.related_groups',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db_reserve)'
            },
            {
                itemName:  'navigation.warehouses',
                disabled:  false,
                link:      book.warehouses,
                color:     'var(--db_reserve)'
            },
            {
                itemName:  'wms.cells',
                disabled:  false,
                link:      book.wms,
                color:     'var(--db_reserve)'
            },
            {
                itemName:  'navigation.units',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db_reserve)'
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
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.norm_hours',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.complexes',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.related_labors',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.repair_map',
                disabled:  false,
                link:      book.repairMapSetting,
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.statuses',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.locations_settings',
                disabled:  false,
                link:      book.locationSettings,
                color:     'var(--db_success)'
            },
            {
                itemName:  'navigation.diagnostic_patterns',
                disabled:  false,
                link:      book.diagnosticPatterns,
                color:     'var(--db_success)'
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
                color:     'var(--approve)'
            },
            {
                itemName:  'navigation.requisites',
                disabled:  false,
                link:      book.requisites,
                color:     'var(--approve)'
            },
            {
                itemName:  'navigation.report_analytics',
                disabled:  false,
                link:      book.analytics,
                color:     'var(--approve)'
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
                color:     'var(--db-comment)',
                oldApp:    true,
            },
            {
                itemName:  'navigation.posts',
                disabled:  true,
                link:      book.exception,
                color:     'var(--db-comment)'
            },
            {
                itemName:  'navigation.cb24',
                disabled:  false,
                link:      book.oldApp.link,
                color:     'var(--db-comment)',
                oldApp:    true,
            },
            {
                itemName:  'navigation.availabilities',
                disabled:  false,
                link:      book.availabilitiesPage,
                color:     'var(--db-comment)'
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

    _renderItem = (blockTitle, {itemName, link, disabled, color, oldApp}, key) => {

        const { user } = this.props;
        const itemDisabled = _.isFunction(disabled)? disabled(user): disabled;

        return (
            <div key={ key } className={ itemDisabled ? Styles.disabledItem + " " + Styles.item : Styles.item }>
                {oldApp ?
                    <a
                        className={Styles.buttonLink}
                        href={link}
                    >
                        <Button className={Styles.itemButton} disabled={itemDisabled} style={{background: color, fontWeight: 500}}>
                            <FormattedMessage id={itemName} />
                        </Button>
                    </a>
                    :
                    <Link to={link} className={Styles.buttonLink}>
                        <Button className={Styles.itemButton} disabled={itemDisabled} style={{background: color, fontWeight: 500}}>
                            <FormattedMessage id={itemName} />
                        </Button>
                    </Link>
                }
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
