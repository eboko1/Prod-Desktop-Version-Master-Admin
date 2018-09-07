// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { fetchClient } from 'core/client/duck';

import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

const mapDispatchToProps = {

};

const mapStateToProps = state => ({
    // clientEntity: state.client.clientEntity,
});

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { clientEntity } = this.props;

        // Client
        return <Catcher>test catch 228 {clientEntity ? JSON.stringify(clientEntity) : null}</Catcher>;
    }
}
