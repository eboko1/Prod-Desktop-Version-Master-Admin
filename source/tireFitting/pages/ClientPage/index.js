// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

// proj
import { fetchClient } from 'core/client/duck';
import { fetchVehicleTypes } from 'core/vehicleTypes/duck';
import { Layout } from 'tireFitting';
import { Spinner } from 'commons';
import { ClientContainer } from 'tireFitting';

const mapStateToProps = state => ({
    // isFetching:   state.ui.clientFetching,
    clientEntity: state.client.clientEntity,
    vehicleTypes: state.vehicleTypes.vehicleTypes,
});

const mapDispatchToProps = {
    fetchClient,
    fetchVehicleTypes,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ClientPage extends Component {
    componentDidMount() {
        this.props.fetchClient(this.props.match.params.id);
        this.props.fetchVehicleTypes();
    }

    render() {
        const { isFetching, clientEntity, match, location, vehicleTypes } = this.props;
        const specificTab = (location && location.state) ? location.state.specificTab : undefined;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout title={ <FormattedMessage id='client_page.title' /> }>
                <ClientContainer
                    clientId={ match.params.id }
                    clientEntity={ clientEntity }
                    specificTab={specificTab}
                    vehicleTypes={vehicleTypes}
                />
            </Layout>
        );
    }
}
