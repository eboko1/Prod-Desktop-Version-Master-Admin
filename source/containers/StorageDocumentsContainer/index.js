// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { StorageTable } from 'containers';
import { StorageDocumentsFilters } from 'components';
import book from 'routes/book';

// own
const fetchStorage = (type, action) => {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = __API_URL__;
    let params = `/store_docs?type=${type}`;
    url += params;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    })
    .then(function (response) {
        if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log('data', data);
        action(data);
    })
    .catch(function (error) {
        console.log('error', error)
    })
}

const mapDispatchToProps = {
    fetchStorage,
};

@withRouter
@injectIntl
@connect(
    null,
    mapDispatchToProps,
)
class StorageDocumentsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageDocumentsList: [],
            filtredDocumentsList: [],
            documentFilters: {
                querySearch: "",
                documentTypeFilter: null,
                documentStatusFilter: null,
            },
        };

        this.querySearchFilter = this.querySearchFilter.bind(this);
        this.documentTypeFilter = this.documentTypeFilter.bind(this);
        this.documentStatusFilter = this.documentStatusFilter.bind(this);
        this.filterDocumentList = this.filterDocumentList.bind(this);
    }

    componentDidMount() {
        fetchStorage(this.props.listType, (data)=>{
            data.list.map((elem, i)=>{
                elem.key = i;
            })
            this.setState({
                storageDocumentsList: data.list,
                filtredDocumentsList: data.list,
            })
        });
    }

    querySearchFilter(value) {
        this.state.documentFilters.querySearch = value;
        this.setState({
            update: true,
        });
        this.filterDocumentList();
    }

    documentTypeFilter(value) {
        this.state.documentFilters.documentTypeFilter = value;
        this.setState({
            update: true,
        });
        this.filterDocumentList();
    }

    documentStatusFilter(value) {
        this.state.documentFilters.documentStatusFilter = value;
        this.setState({
            update: true,
        });
        this.filterDocumentList();
    }

    filterDocumentList() {
        const { storageDocumentsList, documentFilters } = this.state;
        const { querySearch, documentTypeFilter, documentStatusFilter} = documentFilters;
        const isFiltred = querySearch || documentTypeFilter || documentStatusFilter;
       
        if(!isFiltred) {
            this.setState({
                documentFilters: {
                    querySearch: querySearch,
                    documentTypeFilter: documentTypeFilter,
                    documentStatusFilter: documentStatusFilter,
                },
                isFiltred: isFiltred,
                filtredDocumentsList: storageDocumentsList,
            })
        }
        else {
            var resultList = [...storageDocumentsList];

            if(querySearch) {
                resultList = resultList.filter((elem)=>
                    Object.values(elem).find((objValue)=>
                        String(objValue).toLowerCase().includes(querySearch.toLowerCase())
                    )
                );
            }
            if(documentTypeFilter) {
                resultList = resultList.filter((elem)=>elem.type == documentTypeFilter);
            }
            if(documentStatusFilter) {
                resultList = resultList.filter((elem)=>elem.status == documentStatusFilter);
            }
            this.setState({
                documentFilters: {
                    querySearch: querySearch,
                    documentTypeFilter: documentTypeFilter,
                    documentStatusFilter: documentStatusFilter,
                },
                isFiltred: isFiltred,
                filtredDocumentsList: resultList,
            })
        }
    }

    render() {
        const { storageDocumentsList, filtredDocumentsList, isFiltred } = this.state;
        const dateFormat = 'YYYY-MM-DD';
        const thisYear = new Date("1/1/" + (new Date()).getFullYear());
        const dateRange = [moment(thisYear, dateFormat), moment(new Date(), dateFormat)];

        return (
            <Layout
                title={ <FormattedMessage id='navigation.incomes' /> }
                controls={
                    <>
                    <StorageDocumentsFilters 
                        dateRange={dateRange}
                        dateFormat={dateFormat}
                        documentTypeFilter={this.documentTypeFilter}
                        documentStatusFilter={this.documentStatusFilter}
                    />
                    <Link to={ book.storageDocument }>
                        <Button type='primary'>
                            <FormattedMessage id='add' />
                        </Button>
                    </Link>
                    </>
                }
                paper={ false }
            >
                <StorageTable
                    documentsList={filtredDocumentsList}
                    listType={this.props.listType}
                    onSearch={this.querySearchFilter}
                />
            </Layout>
        );
    }
}

export default StorageDocumentsContainer;
