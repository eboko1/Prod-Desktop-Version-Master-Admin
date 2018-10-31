// vendor
import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment';

// proj

export default class ServicesTable extends Component {
    constructor(props) {
        super(props);
        //
        // const {
        //     intl: { formatMessage },
        // } = this.props;

        this.columns = [
            {
                title:     'Наименование работы',
                dataIndex: 'servicename',
                sorter:    true,
                // sortOrder: this._handleColumnOrder(
                //     this.props.sort,
                //     'servicename',
                // ),
                width:     '15%',
            },
            {
                title:     'Наименование ЗЧ',
                dataIndex: 'detailname',
                width:     '20%',
            },
            {
                title:     'Кол-во',
                dataIndex: 'quantity',
                sorter:    true,
                // sortOrder: this._handleColumnOrder(
                //     this.props.sort,
                //     'detailname',
                // ),
                width:     '10%',
            },

            {
                width:  '15%',
                render: (text, record) => (
                    <Icon
                        type='delete'
                        style={ {
                            fontSize: '18px',
                            color:    'var(--warning)',
                            cursor:   'pointer',
                        } }
                        onClick={ () => {
                            props.deleteService(record.id);
                        } }
                    />
                ),
            },
        ];
    }

    render() {
        const { data, count, setPage } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(count / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.page,
            onChange:         page => setPage(page),
        };

        return (
            <Table
                size='small'
                pagination={ pagination }
                dataSource={ data }
                columns={ this.columns }
            />
        );
    }
}
