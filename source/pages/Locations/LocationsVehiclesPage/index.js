// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox, Table, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';

// own
const Option = Select.Option;


export default class LocationsVehiclesPage extends Component {
    constructor(props) {
        super(props);
        this.state={

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.locations_vehicles' /> }
            >

            </Layout>
        );
    }
}