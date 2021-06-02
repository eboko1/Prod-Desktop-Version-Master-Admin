/*
Container used to show clients and perform basic search of them.
*/
//Vendor
import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Input } from 'antd';
import { v4 } from 'uuid';

//Proj
import {
    fetchClients,

    selectClients,
    selectClientsStats,
    selectFetchingClients,
    selectClientsSort,

    setClientsPage,
    setClientsSearchQuery,
    setClientId,
} from 'core/forms/vehicleForm/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user:                state.auth,
    clients:             selectClients(state),
    fetchingClients:     selectFetchingClients(state),
    stats:               selectClientsStats(state),
    sort:                selectClientsSort(state),

});

const mapDispatchToProps = {
    fetchClients,
    setClientsPage,
    setClientsSearchQuery,
    setClientId,
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ClientsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = _.debounce(value => {
            this.props.setClientsSearchQuery({query: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);
    }

    componentDidMount() {
        this.props.fetchClients();

        console.log(fetchClients);
    }

    onSearch = e => {
        const value = e.target.value;
        this.handleSearch(value);
    }

    render() {
        const {
            user,
            clients,
            fetchingClients,
            stats,
            sort,
            setClientsPage,
            setClientId,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "small",
            total: Math.ceil(stats.countClients / 25) * 25,
            hideOnSinglePage: true,
            current: sort.page,
            onChange: page => setClientsPage({page: page}),
        };

        console.log("Clients: ", clients, fetchingClients, stats);

        return (
            <div className={Styles.tableCont}>
                <div className={Styles.filtersCont}>
                    <div className={Styles.textCont}><FormattedMessage id={"client_hot_operations_page.search"} />: </div>
                    <div className={Styles.inputCont}><Input onChange={this.onSearch} allowClear/></div>
                </div>
                
                <Table
                    className={Styles.table}
                    dataSource={clients}
                    size="small"
                    columns={columnsConfig({user})}
                    scroll={ { x: 1000, y: '30vh' } }
                    loading={fetchingClients}
                    rowKey={() => v4()}
                    pagination={pagination}
                    rowClassName={Styles.tableRow}
                    rowSelection={{
                        hideDefaultSelections: true,
                        onSelect: client => {
                            setClientId({clientId: _.get(client, 'clientId')});
                        }
                    }}
                />
            </div>
        );
    }
}