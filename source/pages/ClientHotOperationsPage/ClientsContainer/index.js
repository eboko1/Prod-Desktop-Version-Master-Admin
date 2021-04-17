/*
Container used to show clients and perform basic search of them.
*/
//Vendor
import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from "react-router";
import { Table, Input } from 'antd';
import { v4 } from 'uuid';

//Proj
import { 
    setFiltersSearchQuery,
    setSortPage,
    fetchClientOrders,
    setClientRowKey,
    createOrderForClient,
} from 'core/clientHotOperations/duck';

//Own
import { columnsConfig } from './config';
import ClientOrdersContainer from './ClientOrdersContainer';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user:                state.auth,
    clients:             state.clientHotOperations.clients,
    stats:               state.clientHotOperations.stats,
    clientsFetching:     state.clientHotOperations.clientsFetching,
    sort:                state.clientHotOperations.sort,
    expandedClientRow:   state.clientHotOperations.expandedClientRow,
    searchQuery:         state.clientHotOperations.filters.query
});

const mapDispatchToProps = {
    setFiltersSearchQuery,
    setSortPage,
    fetchClientOrders,
    setClientRowKey,
    createOrderForClient
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
@withRouter
export default class ClientsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = _.debounce(value => {
            this.props.setFiltersSearchQuery(value.replace(/[+()]/g,''));
        }, 1000).bind(this);

        this.urlParams = new URLSearchParams(location.search); //Get params from query sting
        this.initialSearchQuery = this.urlParams.get('initial_search_query'); //Get init search value, we can use it to initialize Inputs
        this.initialSearchQuery && this.props.setFiltersSearchQuery(this.initialSearchQuery.replace(/[+()]/g,'')); //Set filter and fetch data if needed
    }

    onSearch = e => {
        const value = e.target.value;
        this.handleSearch(value);
    }

    /**
     * This event handler is used to create an order which will contain specific client
     * @param {*} param0 Contains clientId which is used to define client in order
     */
    onCreateOrderForClient = ({clientId}) => {
        const {user} = this.props;
        this.props.createOrderForClient({clientId, managerId: user.id});
    }

    render() {
        const {
            clients,
            stats,
            clientsFetching,
            sort,
            setSortPage,
            fetchClientOrders,
            setClientRowKey,
            expandedClientRow,
            searchQuery
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.countClients / 25) * 25,
            hideOnSinglePage: true,
            current: sort.page,
            onChange: page => {
                setSortPage(page);
            },
        };

        return (
            <div>
                <div className={Styles.filtersCont}>
                    <div className={Styles.textCont}><FormattedMessage id={"client_hot_operations_page.search"} />: </div>
                    <div className={Styles.inputCont}><Input defaultValue={this.initialSearchQuery} onChange={this.onSearch} allowClear/></div>
                    
                </div>
                
                <div>
                    <Table
                        className={Styles.table}
                        dataSource={clients}
                        columns={columnsConfig({ onCreateOrderForClient: this.onCreateOrderForClient })}
                        scroll={ { x: 1000, y: '70vh' } }
                        loading={clientsFetching}
                        pagination={pagination}
                        rowKey={(client) => `${client.clientId}`}
                        expandedRowKeys={[expandedClientRow]} //Only one row can be expanded at the time
                        expandedRowRender={() => (<ClientOrdersContainer />)}
                        onExpand={(expanded, client) => {
                            expanded && fetchClientOrders({clientId: client.clientId})
                            expanded && setClientRowKey(`${client.clientId}`)
                            !expanded && setClientRowKey("")
                        }}
                        bordered
                    />
                </div>
            </div>
        );
    }
}