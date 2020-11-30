// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {Layout} from 'commons';
// own

export default class RepairMapSettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { documentFilters } = this.state;
        return (
            <Layout
                title={<FormattedMessage id='navigation.repair_map'/>}
                controls={
                    <div>
                        <Button
                            style={{marginRight: 10}}
                        >
                            <FormattedMessage id='diagnostic-page.import_default' />
                        </Button>
                        <Button
                            type='primary'
                        >
                            <FormattedMessage id='save' />
                        </Button>
                    </div>
                }
            >
                
            </Layout>
        );
    }
}
