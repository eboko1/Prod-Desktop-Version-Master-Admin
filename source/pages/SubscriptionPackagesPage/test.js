// vendor
import React, { Component } from 'react';
import { BackTop } from 'antd';
// proj

// own

export default class BackTopComp extends Component {
    componentDidMount = () => {
        console.log('→ mount');
    };

    render() {
        return <BackTop />;
    }
}
