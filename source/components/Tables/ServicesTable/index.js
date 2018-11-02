// vendor
import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment';

// proj
import { DecoratedInputNumber } from 'forms/DecoratedFields';

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
                dataIndex: 'serviceName',
                // sorter:    true,
                // sortOrder: this._handleColumnOrder(
                //     this.props.sort,
                //     'servicename',
                // ),
                width:     '15%',
            },
            {
                title:     'Наименование ЗЧ',
                dataIndex: 'detailName',
                width:     '20%',
            },
            {
                title:     'Кол-во',
                dataIndex: 'quantity',
                // sorter:    true,
                // sortOrder: this._handleColumnOrder(
                //     this.props.sort,
                //     'detailname',
                // ),
                width:     '10%',
                record:    (text, { key }) => (
                    <DecoratedInputNumber
                        field={ `service[${key}][quantity]` }
                        getFieldDecorator={ props.form.getFieldDecorator }
                        // initialValue={ _getDefaultValue(key, 'quantity') }
                    />
                ),
            },

            {
                width:  '15%',
                render: (text, { serviceId, suggestionId }) =>
                    !serviceId &&
                        <>
                            <Icon
                                type='save'
                                style={ {
                                    fontSize: '18px',
                                    color:    'var(--secondary)',
                                    cursor:   'pointer',
                                } }
                                onClick={ () => {
                                    props.updateService(suggestionId);
                                } }
                            />
                            <Icon
                                type='delete'
                                style={ {
                                    fontSize: '18px',
                                    color:    'var(--warning)',
                                    cursor:   'pointer',
                                } }
                                onClick={ () => {
                                    props.deleteService(suggestionId);
                                } }
                            />
                        </>
                ,
            },
        ];
    }

    // state = {
    //     expandedRowKeys: [],
    // };

    render() {
        const { data, count, setFilter } = this.props;
        console.log('→ TABLE this.props', this.props);
        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(count / 25) * 25,
            hideOnSinglePage: true,
            // current:          this.props.page,
            onChange:         page => setFilter({ page }),
        };

        return (
            <Table
                size='small'
                pagination={ pagination }
                dataSource={ data }
                columns={ this.columns }
                defaultExpandAllRows
                childrenColumnName='details'
                // expandedRowRender={ (record, index, indent, expanded) => {
                //     console.log('→ record', record);
                //     console.log('→ expanded', expanded);
                // } }
            />
        );
    }
}
