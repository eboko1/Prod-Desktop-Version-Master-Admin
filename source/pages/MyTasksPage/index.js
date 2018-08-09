// vendor
import React, { Component } from 'react';
import  MyTasksContainer from 'containers/MyTasksContainer'

import {
    Layout,
    Spinner,

} from 'commons';

class MyTasksPage extends Component {

    /* eslint-disable complexity*/
    render() {
        return (
            <Layout>
                <MyTasksContainer/>
            </Layout>
        ) 
    }
}

export default MyTasksPage;
