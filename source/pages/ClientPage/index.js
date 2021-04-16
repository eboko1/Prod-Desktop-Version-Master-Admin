// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

// proj
import { Layout, Spinner, StyledButton } from 'commons';
import { ClientContainer } from 'containers';
import {
    fetchClient,
    createOrderForClient
} from 'core/client/duck';

const mapStateToProps = state => ({
    user: state.auth,
    // isFetching:   state.ui.clientFetching,
    clientEntity: state.client.clientEntity,
});

const mapDispatchToProps = {
    fetchClient,
    createOrderForClient
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

    /**
     * When we want to create a new order for this client
     */
    onCreateOrderForClient = () => {
        const {
            createOrderForClient,
            clientEntity,
            user
        } = this.props;

        createOrderForClient({
            clientId: clientEntity.clientId,
            managerId: user.id
        });
    }

    render() {
        const { isFetching, clientEntity, match, location, fetchClient } = this.props;
        const specificTab = (location && location.state) ? location.state.specificTab : undefined;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='client_page.title' /> }
                controls={(
                    <div>
                        <StyledButton type="primary" onClick={this.onCreateOrderForClient}>
                            <FormattedMessage id='client_page.create_order' />
                        </StyledButton>
                    </div>
                )}
            >
                <ClientContainer
                    clientId={ match.params.id }
                    clientEntity={ clientEntity }
                    specificTab={ specificTab }
                    fetchClient={ fetchClient }
                />
            </Layout>
        );
    }
}
