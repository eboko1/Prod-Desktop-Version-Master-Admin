// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';

// proj
import {Layout} from 'commons';

// own
import VehiclesTable from './components/VehiclesTable';

/**
 * This page was created to maintain all vehicles of the station(show tables, subtables, controls and other).
 * There is used "feature first" files structure(reffer to react documentaion), it means
 * that each one time used component can be found deeper in a tree structure
 * 
 * Each subcomponent is self-sufficient and requires only necessary data from parrent,
 * other data can be fetched and stored by redux saga/duck.
 * 
 * This page accepts no parameters.
 * 
 * Release date: 31.05.2021
 */
@injectIntl
export default class VehiclesPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout
                title={<FormattedMessage id={ 'vehicles_page.title' }/>}
                description={<FormattedMessage id={'vehicles_page.description'}/>}
                controls={<FormattedMessage id={ 'vehicles_page.controls'}/>}
            >
               <VehiclesTable />
            </Layout>
        )
    }
}