// Vendor
import React, { Component } from 'react';
import { Table, Tabs, Icon, Tooltip } from 'antd';

// Instruments
import uuid from 'uuid';
import Styles from './styles.m.css';

export default class DistributorTableArchive extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterDropdownVisible: false,
            data:                  this.props.data,
            searchText:            '',
            filtered:              false,
        };
        // this._onChange = this._onChange.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._onInputChange = this._onInputChange.bind(this);
        this._getRequests = this._getRequests.bind(this);
    }

    _getRequests = () => {
        const { data } = this.state;

        const requestsArray = data.map(item => (
            <div key={ uuid() }>
                <span>{ item.request }</span>
                <Tooltip placement='top' title={ 'hello!' }>
                    { /* { this.state.data.request } */ }
                    <Icon type='meh-o' />
                </Tooltip>
            </div>
        ));

        return requestsArray;
    };

    _onInputChange = ev => {
        this.setState({ searchText: ev.target.value });
    };

    _onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered:              !!searchText,
            data:                  this.state.data
                .map(item => {
                    // console.log('item', item);
                    const match = item.service.match(reg);
                    if (!match) {
                        return null;
                    }

                    return {
                        ...item,
                        service: (
                            <span>
                                { item.service
                                    .split(reg)
                                    .map(
                                        (text, item) =>
                                            item > 0
                                                ? [
                                                    <span
                                                        className={
                                                            Styles.highlight
                                                        }
                                                    >
                                                        { match[ 0 ] }
                                                    </span>,
                                                    text,
                                                ]
                                                : text,
                                    ) }
                            </span>
                        ),
                    };
                })
                .filter(item => !!item),
        });
    };

    render() {
        // const { data } = this.props;
        const { data } = this.state;

        const columns = [
            {
                title:     'Заказ',
                dataIndex: 'request',
                // key:   'requestCol',
                render:    (_, data) => (
                    <div>
                        <span>{ data.request }</span>
                        <Tooltip placement='top' title={ 'статус!' }>
                            <Icon
                                type='exclamation-circle'
                                style={ { color: '#FF888B' } }
                            />
                        </Tooltip>
                    </div>
                ),
                // render: () =>
                //     data.map((item, index) => (
                //         <div key={ _.uniqueId(`${index}-`) }>
                //             <span>{ item.request }</span>
                //             <Tooltip placement='top' title={ 'hello!' }>
                //                 <Icon type='meh-o' />
                //             </Tooltip>
                //         </div>
                //     )),
                filters: [
                    {
                        text:  'status',
                        value: 'status',
                    },
                    {
                        text:  'new',
                        value: 'new',
                    },
                    {
                        text:     'Submenu',
                        value:    'Submenu',
                        children: [
                            {
                                text:  'Green',
                                value: 'Green',
                            },
                            {
                                text:  'Black',
                                value: 'Black',
                            },
                        ],
                    },
                ],
                // specify the condition of filtering result
                // here is that finding something started with `value`
                onFilter: (value, item) => item.request.indexOf(value) === 0,
            },
            {
                title:     'Поставщик',
                dataIndex: 'service',
                // filterDropdown: (
                //     <div className={ Styles.customFilterDropdown }>
                //         <Input
                //             ref={ele => (this.searchInput = ele)} // eslint-disable-line
                //             placeholder='Поиск СТО'
                //             value={ this.state.searchText }
                //             onChange={ this._onInputChange }
                //             onPressEnter={ this._onSearch }
                //         />
                //         <Button type='primary' onClick={ this._onSearch }>
                //             Искать
                //         </Button>
                //     </div>
                // ),
                // filterIcon: (
                //     <Icon
                //         type='search'
                //         style={ {
                //             color: this.state.filtered ? '#108ee9' : '#aaa',
                //         } }
                //     />
                // ),
                // filterDropdownVisible:         this.state.filterDropdownVisible,
                // onFilterDropdownVisibleChange: visible => {
                //     this.setState(
                //         {
                //             filterDropdownVisible: visible,
                //         },
                //         () => this.searchInput && this.searchInput.focus(),
                //     );
                // },
            },
            {
                title:     'Дата создания',
                dataIndex: 'date',
            },
            {
                title:            'Строк Заказа',
                dataIndex:        'rqCount',
                defaultSortOrder: 'descend',
                sorter:           (a, b) => a.rqCount - b.rqCount,
            },
            {
                title:            'Колличество',
                dataIndex:        'count',
                defaultSortOrder: 'descend',
                sorter:           (a, b) => a.sum - b.sum,
            },
            {
                title:            'Сумма заказа',
                dataIndex:        'sum',
                defaultSortOrder: 'descend',
                sorter:           (a, b) => a.sum - b.sum,
            },
            {
                render: () => <Icon className={ Styles.editIcon } type='edit' />,
            },
        ];

        return (
            <Tabs defaultActiveKey='1'>
                <Tabs.TabPane
                    tab={
                        <span>
                            <Icon
                                type='shopping-cart'
                                className={ Styles.tabIcon }
                            />
                            Заказы
                        </span>
                    }
                    key='1'
                >
                    <Table
                        columns={ columns }
                        dataSource={ data }
                        key='test-table-1'
                    />
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab={
                        <span>
                            <Icon type='form' className={ Styles.tabIcon } />
                            Заявки
                        </span>
                    }
                    key='2'
                >
                    <Table
                        columns={ columns }
                        dataSource={ data }
                        key='test-table-2'
                    />
                </Tabs.TabPane>
            </Tabs>
        );
    }
}
