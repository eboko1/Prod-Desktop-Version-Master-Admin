// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Layout } from 'tireFitting';
import { Spinner } from 'commons';
import { ProfileForm } from 'forms';

@connect(state => ({ profileUpdating: state.ui.profileUpdating }))
export default class Profile extends Component {
    render() {
        const { profileUpdating } = this.props;

        return profileUpdating ? (
            <Spinner spin={ profileUpdating } />
        ) : (
            <Layout
                title={ <FormattedMessage id='profile.title' /> }
                description={ <FormattedMessage id='profile.description' /> }
            >
                <ProfileForm />
            </Layout>
        );
    }
}
