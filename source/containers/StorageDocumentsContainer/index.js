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
const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      SUPPLIER = 'SUPPLIER',
      RESERVE = 'RESERVE',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTION = 'OWN_CONSUMPTION',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDERINCOME = 'ORDERINCOME',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE',
      MAIN = 'MAIN',
      TOOL = 'TOOL',
      REPAIR_AREA= 'REPAIR_AREA';
      
const dateFormat = 'DD.MM.YYYY';
const fetchStorage = (type, docType, action) => {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = __API_URL__ + `/store_docs?`;
    if(type == ORDER) {
        url += `context=${type}`;
    }
    else {
        url += `type=${type}&context=STOCK`
        if(docType) url += `&documentType=${docType}`
    }
    

    fetch(url, {
        method:  'GET',
        headers: {
            Authorization: token,
        },
    })
    .then(function(response) {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText));
        }

        return Promise.resolve(response);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        if(docType != TRANSFER) {
            data.list = data.list.filter((elem)=>elem.documentType != TRANSFER);
        }
        action(data);
    })
    .catch(function(error) {
        console.log('error', error);
    });
};

const mapDispatchToProps = {
    fetchStorage,
};

@withRouter
@injectIntl
@connect(null, mapDispatchToProps)
class StorageDocumentsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageDocumentsList: [],
            filtredDocumentsList: [],
            documentFilters:      {
                querySearch:          '',
                documentTypeFilter:   null,
                documentStatusFilter: null,
                documentWarehouseFilter: ["", ""],
            },
            dateRange: [],
        };

        this.onDateChange = this.onDateChange.bind(this);
        this.querySearchFilter = this.querySearchFilter.bind(this);
        this.documentTypeFilter = this.documentTypeFilter.bind(this);
        this.documentStatusFilter = this.documentStatusFilter.bind(this);
        this.documentWarehouseFilter = this.documentWarehouseFilter.bind(this);
        this.filterDocumentList = this.filterDocumentList.bind(this);
    }

    componentDidMount() {
        const thisYear = new Date('1/1/' + new Date().getFullYear());
        const dateRange = [ moment(thisYear, dateFormat), moment(new Date(), dateFormat) ];

        fetchStorage(this.props.listType, this.props.docType, data => {
            data.list.map((elem, i) => {
                elem.key = i;
            });
            const resutList = data.list.filter(elem =>
                moment(elem.createdDatetime).isBetween(
                    dateRange[ 0 ],
                    dateRange[ 1 ],
                ));
            this.setState({
                dateRange:            dateRange,
                storageDocumentsList: resutList,
                filtredDocumentsList: resutList,
            });
        });
    }

    onDateChange(dateRange) {
        if (!dateRange.length) {
            const thisYear = new Date('1/1/' + new Date().getFullYear());
            const defaultDateRange = [ moment(thisYear, dateFormat), moment(new Date(), dateFormat) ];
            dateRange = defaultDateRange;
        }
        fetchStorage(this.props.listType, this.props.docType, data => {
            data.list.map((elem, i) => {
                elem.key = i;
            });
            const resutList = data.list.filter(elem =>
                moment(elem.createdDatetime).isBetween(
                    dateRange[ 0 ],
                    dateRange[ 1 ],
                ));
            this.setState({
                dateRange:            dateRange,
                storageDocumentsList: resutList,
                filtredDocumentsList: resutList,
            });
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

    documentWarehouseFilter(warehouseInput) {
        this.state.documentFilters.documentWarehouseFilter = warehouseInput;
        this.setState({
            update: true,
        });
        this.filterDocumentList();
    }

    filterDocumentList() {
        const { storageDocumentsList, documentFilters } = this.state;
        const {
            querySearch,
            documentTypeFilter,
            documentStatusFilter,
            documentWarehouseFilter,
        } = documentFilters;
        const isFiltred =
            querySearch || documentTypeFilter || documentStatusFilter || (documentWarehouseFilter[0] || documentWarehouseFilter[1]);

        if (!isFiltred) {
            this.setState({
                documentFilters: {
                    querySearch:          querySearch,
                    documentTypeFilter:   documentTypeFilter,
                    documentStatusFilter: documentStatusFilter,
                },
                isFiltred:            isFiltred,
                filtredDocumentsList: storageDocumentsList,
            });
        } else {
            var resultList = [ ...storageDocumentsList ];

            if (querySearch) {
                resultList = resultList.filter(elem =>
                    Object.values(elem).find(objValue =>
                        String(objValue)
                            .toLowerCase()
                            .includes(querySearch.toLowerCase())));
            }
            if (documentTypeFilter) {
                resultList = resultList.filter(
                    elem => elem.documentType == documentTypeFilter,
                );
            }
            if (documentStatusFilter) {
                resultList = resultList.filter(
                    elem => elem.status == documentStatusFilter,
                );
            }
            if (documentWarehouseFilter && (documentWarehouseFilter[0] || documentWarehouseFilter[1])) {
                resultList = resultList.filter(
                    elem => {
                        if(documentWarehouseFilter[0] && documentWarehouseFilter[1]) {
                            return (
                                String(elem.warehouseName).toLowerCase().includes(documentWarehouseFilter[0].toLowerCase()) ||
                                String(elem.warehouseName).toLowerCase().includes(documentWarehouseFilter[1].toLowerCase())
                            )
                        }
                        else if(documentWarehouseFilter[0]) {
                            return (
                                String(elem.warehouseName).toLowerCase().includes(documentWarehouseFilter[0].toLowerCase())
                            )
                        }
                        else if(documentWarehouseFilter[1]) {
                            return (
                                String(elem.warehouseName).toLowerCase().includes(documentWarehouseFilter[1].toLowerCase())
                            )
                        }
                    },
                );
            }
            this.setState({
                documentFilters: {
                    querySearch:             querySearch,
                    documentTypeFilter:      documentTypeFilter,
                    documentStatusFilter:    documentStatusFilter,
                    documentWarehouseFilter: documentWarehouseFilter,
                },
                isFiltred:            isFiltred,
                filtredDocumentsList: resultList,
            });
        }
    }

    render() {
        const { dateRange, filtredDocumentsList, isFiltred } = this.state;

        return (
            <Layout
                title={ <FormattedMessage id={`navigation.${
                    this.props.docType == TRANSFER ? 
                    'transfer' : 
                    this.props.listType.toLowerCase()
                }s`} /> }
                controls={
                    <>
                        <StorageDocumentsFilters
                            type={this.props.newDocType}
                            dateRange={ dateRange }
                            dateFormat={ dateFormat }
                            onDateChange={ this.onDateChange }
                            documentTypeFilter={ this.documentTypeFilter }
                            documentStatusFilter={ this.documentStatusFilter }
                        />
                        <Link
                            to={{
                                pathname: book.storageDocument,
                                type: this.props.newDocType
                            }}
                        >
                            <Button type='primary'>
                                <FormattedMessage id='add' />
                            </Button>
                        </Link>
                    </>
                }
                paper={ false }
            >
                <StorageTable
                    docType={this.props.newDocType}
                    documentsList={ filtredDocumentsList }
                    listType={ this.props.listType }
                    onSearch={ this.querySearchFilter }
                    documentWarehouseFilter={ this.documentWarehouseFilter }
                />
            </Layout>
        );
    }
}

export default StorageDocumentsContainer;
