// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Table, Icon, Modal, notification } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
// import { PackageForm, AddPackageForm } from 'forms';
import book from 'routes/book';

// own
import { setSort, setPage } from 'core/businessPackage/duck';
import Styles from './styles.m.css';

const mapDispatchToProps = {
    setSort,
    setPage,
};

const mapStateToProps = state => ({
    businessPackages: state.businessPackage.businessPackages,
    errors:           state.businessPackage.errors,
    sort:             state.businessPackage.sort,
    page:             state.businessPackage.page,
});

const openNotificationWithIcon = (type, message, description) => {
    notification[ type ]({
        message,
        description,
    });
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class BusinessPackageContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { businessPackages, sort } = this.props;

        const sortOptions = {
            asc:  'ascend',
            desc: 'descend',
        };

        const columns = [
            {
                title:     'businessName',
                dataIndex: 'businessName',
                sorter:    true,
                sortOrder:
                    this.props.sort.field === 'businessName'
                        ? sortOptions[ sort.order ]
                        : false,
                width:  '15%',
                render: (name, record) => record.businessName,
            },
            {
                title:     'businessAddress',
                dataIndex: 'businessAddress',
                width:     '20%',
                render:    (name, record) => record.businessAddress,
            },
            {
                title:     'activationDatetime',
                dataIndex: 'activationDatetime',
                sorter:    true,
                sortOrder:
                    this.props.sort.field === 'activationDatetime'
                        ? sortOptions[ sort.order ]
                        : false,
                width:  '15%',
                render: (name, record) => record.activationDatetime,
            },
            {
                title:     'expirationDatetime',
                dataIndex: 'expirationDatetime',
                sorter:    true,
                sortOrder:
                    this.props.sort.field === 'expirationDatetime'
                        ? sortOptions[ sort.order ]
                        : false,
                width:  '15%',
                render: (name, record) => record.expirationDatetime,
            },
            {
                title:     'packageName',
                dataIndex: 'packageName',
                sorter:    true,
                sortOrder:
                    this.props.sort.field === 'packageName'
                        ? sortOptions[ sort.order ]
                        : false,
                width:  '20%',
                render: (name, record) => record.packageName,
            },

            {
                // title:  <FormattedMessage id='package-container.edit' />,
                width:  '15%',
                render: record => (
                    <Icon
                        // onClick={ () => this.props.setEditPackageId(record.id) }
                        // className={ Styles.editPackageIcon }
                        type='edit'
                    />
                ),
            },
        ];

        const handleTableChange = (pagination, filters, sorter) => {
            if (!sorter) {
                return;
            }
            const sort = {
                field: sorter.field,
                order: sorter.order === 'ascend' ? 'asc' : 'desc',
            };

            if (!_.isEqual(sort, this.props.sort)) {
                this.props.setSort(sort);
            }
        };

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.count / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.page,
            onChange:         page => {
                this.props.setPage(page);
            },
        };

        return (
            <Catcher>
                <Table
                    size='small'
                    onChange={ handleTableChange }
                    pagination={ pagination }
                    dataSource={ businessPackages }
                    columns={ columns }
                />
            </Catcher>
        );
    }
}
