// vendor
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Input, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
// proj
import { Catcher } from 'commons';

// own
import { columnsConfig, rowsConfig, scrollConfig } from './storageTableConfig';
import Styles from './styles.m.css';

const mapState = state => ({
    user: state.auth,
});

@connect(mapState)
@withRouter
@injectIntl
class StorageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    render() {
        const { documentsList, match, listType, onSearch, docType, hideFilters, isCRUDForbidden } = this.props;
        const { formatMessage } = this.props.intl;
        const columns = columnsConfig(
            isCRUDForbidden,
            match.path,
            listType,
            formatMessage,
            () => {
                alert('...');
            },
        );

        return (
            <Catcher>
                {!hideFilters &&
                    <div className={ Styles.filterWrap }>
                        <Input
                            placeholder={ formatMessage({
                                id: 'orders.search.placeholder',
                            }) }
                            onChange={ event => {
                                onSearch(event.target.value);
                            } }
                            allowClear
                        />
                        <Input
                            allowClear
                            style={{
                                width: '30%'
                            }}
                            disabled={ docType == 'INCOME' || docType == 'ORDER' }
                            placeholder={formatMessage({id:'storage_document.storage_expenses'})}
                            onChange={(event)=>{
                                this.props.documentWarehouseFilter([
                                    event.target.value,
                                    ""
                                ]);
                            }}
                        />
                        <Input
                            allowClear
                            style={{
                                width: '30%'
                            }}
                            disabled={ docType == 'EXPENSE' || docType == 'ORDER' }
                            placeholder={formatMessage({id:'storage_document.storage_income'})}
                            onChange={(event)=>{
                                this.props.documentWarehouseFilter([
                                    "",
                                    event.target.value
                                ]);
                            }}
                        />  
                    </div>
                }
                <div className={ Styles.paper }>
                    <Table
                        size='small'
                        className={ Styles.documentsTable }
                        dataSource={ documentsList }
                        columns={ columns }
                        locale={ {
                            emptyText: <FormattedMessage id='no_data' />,
                        } }
                    />
                </div>
            </Catcher>
        );
    }
}

export default StorageTable;
