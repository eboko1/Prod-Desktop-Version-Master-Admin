// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button, Icon } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { StorageTable } from 'containers';
import { StorageDocumentsFilters } from 'components';
import book from 'routes/book';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { CashOrderModal } from 'modals';

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
      REPAIR_AREA= 'REPAIR_AREA',
      STOCK = "STOCK";
      
const dateFormat = 'DD.MM.YYYY';
const fetchStorage = (type, action) => {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = __API_URL__ + `/store_docs`;
    switch(type) {
        case INCOME:
            url += `?types=["${INCOME}"]&documentTypes=["${SUPPLIER}","${CLIENT}","${INVENTORY}"]&contexts=["${STOCK}"]`
            break;
        case EXPENSE:
            url += `?types=["${EXPENSE}"]&documentTypes=["${SUPPLIER}","${CLIENT}","${INVENTORY}","${OWN_CONSUMPTION}"]&contexts=["${STOCK}"]`
            break;
        case TRANSFER:
            url += `?types=["${EXPENSE}"]&documentTypes=["${TRANSFER}"]&contexts=["${STOCK}"]`
            break;
        case ORDER:
            url += `?contexts=["${ORDER}"]`
            break;
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
        data.list = data.list.filter((elem)=>elem.documentNumber.substr(0, 3) != 'RES');
        action(data);
    })
    .catch(function(error) {
        console.log('error', error);
    });
};

const mapStateToProps = state => {
    return {
        modal:       state.modals.modal,
        modalProps:  state.modals.modalProps,
    };
};

const mapDispatchToProps = {
    fetchStorage,
    setModal,
    resetModal,
};

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class StorageDocumentsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageDocumentsList: [],
            filtredDocumentsList: [],
            documentFilters:      {
                querySearch:          '',
                typeFilter:           null,
                documentTypeFilter:   null,
                documentStatusFilter: null,
                documentWarehouseFilter: ["", ""],
            },
            dateRange: [],
            documentType: undefined,
        };

        this.onDateChange = this.onDateChange.bind(this);
        this.querySearchFilter = this.querySearchFilter.bind(this);
        this.typeFilter = this.typeFilter.bind(this);
        this.documentTypeFilter = this.documentTypeFilter.bind(this);
        this.documentStatusFilter = this.documentStatusFilter.bind(this);
        this.documentWarehouseFilter = this.documentWarehouseFilter.bind(this);
        this.filterDocumentList = this.filterDocumentList.bind(this);
    }

    componentDidMount() {
        const thisYear = new Date('1/1/' + new Date().getFullYear());
        const dateRange = [ moment(thisYear, dateFormat), moment(new Date(), dateFormat) ];

        fetchStorage(this.props.listType, data => {
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
        fetchStorage(this.props.listType, data => {
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

    typeFilter(value) {
        this.state.documentFilters.typeFilter = value;
        this.setState({
            update: true,
        });
        this.filterDocumentList();
    }

    documentTypeFilter(value, documentType) {
        this.state.documentFilters.documentTypeFilter = value;
        this.setState({
            update: true,
            documentType: documentType,
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
            typeFilter,
            documentTypeFilter,
            documentStatusFilter,
            documentWarehouseFilter,
        } = documentFilters;
        const isFiltred =
            querySearch || typeFilter || documentTypeFilter || documentStatusFilter || (documentWarehouseFilter[0] || documentWarehouseFilter[1]);

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
            if (typeFilter) {
                resultList = resultList.filter(
                    elem => elem.type == typeFilter,
                );
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
                    typeFilter:              typeFilter,    
                    documentTypeFilter:      documentTypeFilter,
                    documentStatusFilter:    documentStatusFilter,
                    documentWarehouseFilter: documentWarehouseFilter || ["", ""],
                },
                isFiltred:            isFiltred,
                filtredDocumentsList: resultList,
            });
        }
    }

    render() {
        const { newDocType, isCRUDForbidden, listType, modal, modalProps, setModal, resetModal } = this.props;
        const { dateRange, filtredDocumentsList, documentFilters, documentType, isFiltred } = this.state;
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
                            isFetched={Boolean(filtredDocumentsList.length)}
                            type={newDocType}
                            dateRange={ dateRange }
                            dateFormat={ dateFormat }
                            onDateChange={ this.onDateChange }
                            typeFilter={ this.typeFilter }
                            documentTypeFilter={ this.documentTypeFilter }
                            documentStatusFilter={ this.documentStatusFilter }
                        />
                        {listType == 'EXPENSE' &&
                            <Button
                                style={ {
                                    margin:   '0 15px 0 0',
                                    fontSize: 18,
                                } }
                                onClick={()=>{
                                    setModal(MODALS.CASH_ORDER, {
                                        fromStoreDoc: true,
                                    });
                                }}
                            >
                                <Icon type='dollar'/>
                            </Button>
                        }
                        <Link
                            to={!isCRUDForbidden && {
                                pathname: book.storageDocument,
                                state:    {
                                    formData: {
                                        type: newDocType,
                                        documentType: documentType || documentFilters.documentTypeFilter,
                                    }
                                },
                            }}
                        >
                            <Button type='primary' disabled={isCRUDForbidden}>
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
                    isCRUDForbidden={isCRUDForbidden}
                />
                <CashOrderModal
                    fromStoreDoc
                    visible={modal}
                    modalProps={modalProps}
                    resetModal={ () => {
                        resetModal();
                    } }
                />
            </Layout>
        );
    }
}

export default StorageDocumentsContainer;
