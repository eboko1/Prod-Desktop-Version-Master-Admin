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
import { StorageDocumentsContainer } from 'containers';

// own

class IncomesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <StorageDocumentsContainer
                listType = 'INCOME'
                newDocType = 'INCOME'
            />
        );
    }
}

export default IncomesPage;
