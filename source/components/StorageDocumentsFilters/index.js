// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DatePicker, Icon, Radio } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const { RangePicker } = DatePicker;


@injectIntl
class StorageDocumentsFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: undefined,
        };
    }

    render() {
        const { dateRange, dateFormat, documentTypeFilter, documentStatusFilter } = this.props;
        return (
            <div className={Styles.filtersWrap}>
                <div className={Styles.filterRadioButtonGroup}>
                    <Radio.Group
                        buttonStyle="solid"
                        onChange={(event)=>{
                            documentTypeFilter(event.target.value)
                        }}
                        defaultValue={null}
                    >
                        <Radio.Button value={null}>
                            <FormattedMessage id='storage_document.all'/>
                        </Radio.Button>
                        <Radio.Button value="INCOME">
                            <FormattedMessage id='storage_document.income'/>
                        </Radio.Button>
                        <Radio.Button value="RETURN">
                            <FormattedMessage id='storage_document.return'/>
                        </Radio.Button>
                        <Radio.Button value="EXCESS">
                            <FormattedMessage id='storage_document.excess'/>
                        </Radio.Button>
                    </Radio.Group>
                </div>
                <div className={Styles.filterRadioButtonGroup}>
                    <Radio.Group
                        buttonStyle="solid"
                        onChange={(event)=>{
                            documentStatusFilter(event.target.value)
                        }}
                        defaultValue={null}
                    >
                        <Radio.Button value={null}>
                            <FormattedMessage id='storage_document.all'/>
                        </Radio.Button>
                        <Radio.Button value="NEW">
                            <FormattedMessage id='storage_document.status_created'/> <Icon type='clock-circle' theme='filled' style={{color: 'var(--orange)'}}/>
                        </Radio.Button>
                        <Radio.Button value="DONE">
                            <FormattedMessage id='storage_document.status_confirmed'/> <Icon type='check-circle' theme='filled' style={{color: 'var(--green)'}}/>
                        </Radio.Button>
                    </Radio.Group>
                </div>
                <div className={Styles.filterDatePicker}>
                    <RangePicker
                        defaultValue={dateRange}
                        format={dateFormat}
                    />
                </div>
            </div>
        );
    }
}

export default StorageDocumentsFilters;
