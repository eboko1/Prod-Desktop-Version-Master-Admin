'use strict'

//vendor
import React, {Component} from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import {Input } from 'antd';
import moment from 'moment';

//proj
import { DateRangePicker } from 'components';

//own
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'YYYY/MM/DD';
const DEF_UI_DATE_FORMAT = 'DD/MM/YYYY';

export default class ReportLoadKPIFilter extends Component {

    constructor(props) {
        super(props);
       
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
        const {
            setReportLoadKPIQuery,
            fetchReportLoadKPI
        } = this.props.filterControls;
        setReportLoadKPIQuery(e.target.value);
        fetchReportLoadKPI();
    }

    render() {

        const {
            filter,
        } = this.props;

        return (
            <div className={Styles.mainCont}>
                <div className={Styles.datePickerCont}>
                    <DateRangePicker
                        style={{margin: 0}}//prevent default margin
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