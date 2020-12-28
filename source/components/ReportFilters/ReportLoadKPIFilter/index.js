'use strict'

//vendor
import React, {Component} from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import {Input } from 'antd';
import moment from 'moment';
import _ from 'lodash';

//proj
import { DateRangePicker } from 'components';

//own
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'YYYY/MM/DD';
const DEF_UI_DATE_FORMAT = 'DD/MM/YYYY';

export default class ReportLoadKPIFilter extends Component {

    constructor(props) {
        super(props);

        this.handleSearch = _.debounce(value => {
            const {
                setReportLoadKPIQuery,
                fetchReportLoadKPI
            } = this.props.filterControls;
            setReportLoadKPIQuery(value);
            fetchReportLoadKPI();
        }, 1000).bind(this);
       
    }

    setDoneDaterange = daterange => {
        const {
            setReportLoadKPIDoneFromDate,
            setReportLoadKPIDoneToDate,
            fetchReportLoadKPI
        } = this.props.filterControls;
        const [ startDate, endDate ] = daterange;
        
        setReportLoadKPIDoneFromDate(startDate? startDate.format(DEF_DATE_FORMAT): undefined);
        setReportLoadKPIDoneToDate(endDate? endDate.format(DEF_DATE_FORMAT): undefined);
        fetchReportLoadKPI();
    };

    onSearch = e => {
        const value = e.target.value.replace(/[+()]/g,'');
        this.handleSearch(value);
    }

    render() {

        const {
            filter,
            disabled
        } = this.props;

        //If it is needed to disable filters just set this style to main container
        const disabledStyle = {
            pointerEvents: 'none',
            opacity: '0.7'
        };

        return (
            <div className={Styles.mainCont} style={disabled ? disabledStyle: undefined }>
                <div className={Styles.datePickerCont} disabled={disabled}>
                    <DateRangePicker
                        className={Styles.datePicker}
                        dateRange={[moment(filter.doneFromDate), moment(filter.doneToDate)]}
                        onDateChange={ this.setDoneDaterange }
                    />
                </div>
                <div className={Styles.inputCont}>
                    <Input
                        className={Styles.input}
                        placeholder="Search"
                        onChange={this.onSearch}
                    />
                </div>
            </div>
        )
    }
}