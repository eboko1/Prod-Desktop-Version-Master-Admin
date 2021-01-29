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
import { permissions, isForbidden } from 'utils';

// own
const mapStateToProps = state => ({
    user: state.auth,
});

@connect( mapStateToProps, void 0 )
class StorageOrdersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentFilters: undefined,
        };
    }

    render() {
        const { user } = this.props;
        const { documentFilters } = this.state;
        const isCRUDForbidden = isForbidden(user, permissions.ACCESS_SUPPLIER_ORDER_STORE_DOCS_CRUD);
        return (
            <StorageDocumentsContainer
                listType = 'ORDER'
                newDocType = 'ORDER'
                isCRUDForbidden={isCRUDForbidden}
            />
        );
    }
}

export default StorageOrdersPage;
