/*
Container used to show clients and perform basic search of them.
*/
//Vendor
import React from 'react';
import { connect } from "react-redux";
import { Table, Input } from 'antd';
import { v4 } from 'uuid';

//Proj
import { setFiltersSearchQuery, setSortPage } from 'core/clientHotOperations/duck';

//Own
import { columnsConfig } from './config';

const mapStateToProps = state => ({
    user: state.auth,
    clients: state.clientHotOperations.clients,
    stats: state.clientHotOperations.stats,
    clientsFetching: state.clientHotOperations.clientsFetching,
    sort: state.clientHotOperations.sort
});

const mapDispatchToProps = {
    setFiltersSearchQuery,
    setSortPage
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = _.debounce(value => {
            this.props.setFiltersSearchQuery(value);
        }, 1000).bind(this);
    }

    onSearch = e => {
        const value = e.target.value.replace(/[+()]/g,'');
        this.handleSearch(value);
    }

    render() {
        const {
            clients,
            stats,
            clientsFetching,
            sort,
            setSortPage
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.countClients / 25) * 25,
            hideOnSinglePage: true,
            current: sort.page,
            onChange: page => {
                this.props.setSortPage(page);
            },
        };

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center', padding: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', padding: '5px', alignItems: 'center'}}>Search: </div>
                    <div style={{width: '40%'}}><Input onChange={this.onSearch}/></div>
                    
                </div>
                
                <div>
                    <Table
                        dataSource={clients}
                        columns={columnsConfig()}
                        scroll={ { x: 1000, y: '30vh' } }
                        loading={clientsFetching}
                        pagination={pagination}
                        rowKey={() => v4()}
                        bordered
                    />
                </div>
            </div>
        );
    }
}