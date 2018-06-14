// Core
import React, { Component } from 'react';

import { Layout } from 'commons';
import { DistributorTable } from 'components';

export default class DistributorDash extends Component {
    render() {
        return (
            <Layout
                title='Запросы от СТО'
                description='отвечайте онлайн на запросы СТО'
            >
                <DistributorTable />
            </Layout>
        );
    }
}
