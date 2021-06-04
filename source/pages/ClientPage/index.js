// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Popover } from 'antd';

// proj
import { MODALS, setModal } from 'core/modals/duck';
import { VehicleModal } from 'modals';
import { Layout, Spinner } from 'commons';
import { ClientContainer } from 'containers';
import { permissions, isForbidden } from 'utils';
import {
    fetchClient,
    createOrderForClient
} from 'core/client/duck';

//Own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    clientEntity: state.client.clientEntity,
});

const mapDispatchToProps = {
    fetchClient,
    createOrderForClient,
    setModal
};

@injectIntl
@connect( mapStateToProps, mapDispatchToProps )
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

    /**
     * Open modal to add a new vehicle for current client
     */
    onAddVehicle = () => {
        const { clientEntity } = this.props;

        this.props.setModal(MODALS.VEHICLE, {mode: "ADD", clientId: clientEntity.clientId});
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
                        <span className={Styles.controlButton}>
                            <Popover content={<FormattedMessage id="client_page.hint_create_order_with_client"/>}>
                                <Button
                                    type="primary"
                                    onClick={this.onCreateOrderForClient}
                                    disabled={ isForbidden(user, permissions.CREATE_ORDER) }
                                >
                                    <FormattedMessage id='client_page.create_order' />
                                </Button>
                            </Popover>
                        </span>
                        <span className={Styles.controlButton}>
                            <Popover content={<FormattedMessage id="vehicle_page.hint_add_vehicle_modal"/>}>
                                <Button
                                    type="primary"
                                    onClick={ this.onAddVehicle }
                                    disabled={ isForbidden(user, permissions.CREATE_EDIT_DELETE_CLIENTS) }
                                >
                                    <FormattedMessage id='vehicle_page.hint_add_vehicle_modal' />
                                </Button>
                            </Popover>
                        </span>
                    </div>
                )}
            >
                <ClientContainer
                    clientId={ match.params.id }
                    clientEntity={ clientEntity }
                    specificTab={ specificTab }
                    fetchClient={ fetchClient }
                />

                <VehicleModal
                    onClose={() => fetchClient(clientEntity.clientId)}
                />
            </Layout>
        );
    }
}
