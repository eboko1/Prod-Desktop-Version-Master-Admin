// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

// proj
import { fetchClient } from 'core/client/duck';
import { Layout, Spinner } from 'commons';
import { ClientContainer } from 'containers';

const mapStateToProps = state => ({
    // isFetching:   state.ui.clientFetching,
    clientEntity: state.client.clientEntity,
});

const mapDispatchToProps = {
    fetchClient,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ClientPage extends Component {
    componentDidMount() {
        this.props.fetchClient(this.props.match.params.id);
    }

    render() {
        const { isFetching, clientEntity, match, location } = this.props;
        const specificTab = (location && location.state) ? location.state.specificTab : undefined;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout title={ <FormattedMessage id='client_page.title' /> }>
                <ClientContainer
                    clientId={ match.params.id }
                    clientEntity={ clientEntity }
                    specificTab={specificTab}
                />
            </Layout>
        );
    }
}
