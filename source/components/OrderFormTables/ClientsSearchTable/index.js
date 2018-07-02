// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

class DetailsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                // title:     <FormattedMessage id='order_form_table.detail_name' />,
                title:     'client name',
                dataIndex: 'name',
            },
            {
                title:     'client surname',
                dataIndex: 'surname',
            },
            {
                title:     'client phone',
                dataIndex: 'phones',
            },
            {
                title:     'client emails',
                dataIndex: 'emails',
            },
        ];
    }

    render() {
        const { clients, visible, setClientSelection } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ clients }
                    className={
                        visible
                            ? Styles.clientsSearchTable
                            : Styles.clientsSearchTableHidden
                    }
                    columns={ columns }
                    pagination={ false }
                    onRow={ (record) => {
                        return {
                            onClick: () => {
                                setClientSelection(record);
                            },
                        };
                    }}
                    // scroll={ { y: 200 } }
                />
            </Catcher>
        );
    }
}

export default DetailsTable;
