// Vendor
import React, { Component } from 'react';
import { Table, Tabs, Icon, Tooltip } from 'antd';

// Instruments
import uuid from 'uuid';
import Styles from './styles.m.css';

import { withAnt } from './withAnt';

@withAnt
export default class DistributorTableResponse extends Component {
    render() {
        const { data, columns } = this.props;

        return (
            <Table
                className={ Styles.distributorTableResponse }
                columns={ columns }
                dataSource={ data }
            />
        );
    }
}
