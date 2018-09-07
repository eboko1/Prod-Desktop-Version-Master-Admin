// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import { fetchClient } from 'core/client/duck';

import { Layout, Spinner } from 'commons';
import { ClientContainer } from 'containers';

const mapStateToProps = state => ({
    isFetching:   state.ui.clientFetching,
    clientEntity: state.client.clientEntity,
});

const mapDispatchToProps = {
    fetchClient,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientPage extends Component {
    componentDidMount() {
        this.props.fetchClient(this.props.match.params.id);
    }

    render() {
        const { isFetching, clientEntity, match } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout title={ <FormattedMessage id='client' /> }>
                <ClientContainer
                    clientId={ match.params.id }
                    clientEntity={ clientEntity }
                />
            </Layout>
        );
    }
}
