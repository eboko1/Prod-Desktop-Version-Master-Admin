// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';

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
                key:       'name',
            },
            {
                title:     'client surname',
                dataIndex: 'surname',
                key:       'surname',
            },
            {
                title:     'client phone',
                dataIndex: 'phones',
                key:       'phones',
            },
            {
                title:     'client emails',
                dataIndex: 'emails',
                key:       'emails',
            },
        ];
    }

    render() {
        const {
            clients,
            visible,
            setClientSelection,
            clientsSearching,
        } = this.props;
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
                    loading={ clientsSearching }
                    onRow={ record => {
                        return {
                            onClick: () => {
                                setClientSelection(record);
                            },
                        };
                    } }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    // scroll={ { y: 200 } }
                />
            </Catcher>
        );
    }
}

export default DetailsTable;
