// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Layout } from 'commons';
import { ProfileForm } from 'forms';

class Profile extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='profile.title' /> }
                description={ <FormattedMessage id='profile.description' /> }
            >
                <ProfileForm />
            </Layout>
        );
    }
}

export default Profile;
