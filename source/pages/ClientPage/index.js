// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Popover } from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { ClientContainer } from 'containers';
import { permissions, isForbidden } from 'utils';
import {
    fetchClient,
    createOrderForClient
} from 'core/client/duck';

const mapStateToProps = state => ({
    user: state.auth,
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
        const { isFetching, clientEntity, match, location, fetchClient, user } = this.props;
        const specificTab = (location && location.state) ? location.state.specificTab : undefined;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='client_page.title' /> }
                controls={(
                    <div>
                        <Popover content={<FormattedMessage id="client_page.hint_create_order_with_client"/>}>
                            <Button
                                type="primary"
                                onClick={this.onCreateOrderForClient}
                                disabled={ isForbidden(user, permissions.CREATE_ORDER) }
                            >
                                <FormattedMessage id='client_page.create_order' />
                            </Button>
                        </Popover>
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
