/*
    This component shows stats
*/

//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import _ from 'lodash';

//proj
import { Numeral } from "commons";

//own
import Styles from './styles.m.css';

export default class Stats extends React.Component {
    constructor(props) {
        super(props);
    }

    statsBlockComp(args) {
        const {title, value} = args;
        return (
            <div className={Styles.statsBlock}>
                <div className={Styles.statsHeader}>{title}</div>
                <div className={Styles.statsText}>
                    {
                        parseInt(value)
                            ? (<Numeral>{parseInt(value)}</Numeral>)
                            : "-"
                    }
                </div>
            </div>
        );
    }

    render() {

        const {
            totalRowsCount,
            totalLaborsPlan,
            totalWorkingTime,
            totalStoppedTime,
            totalInternalParkingDuration,
            totalExternalParkingDuration,
            totalWorkPostParkingDuration,
            totalOtherParkingDuration,
        } = this.props.stats;

        const totalParkingDuration = _.sum([totalInternalParkingDuration, totalExternalParkingDuration, totalWorkPostParkingDuration, totalOtherParkingDuration]);
        const totalPlanPerfomance = (totalWorkingTime != 0)? totalLaborsPlan/totalWorkingTime: NaN;
        const totalDepartmentPerfomance = totalWorkingTime/(totalWorkingTime+totalStoppedTime);
        const totalStationPerfomance = totalWorkingTime/totalParkingDuration;

        const StatsBlock = this.statsBlockComp;

        return (
            <div className={Styles.statsMainCont}>
                <div className={Styles.statsCont}>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.planner'} />} value={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.labors_plan'} />} value={totalLaborsPlan}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.labors_actual'} />} value={totalWorkingTime}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.breaks'} />} value={totalStoppedTime}/>

                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.internal_parking'} />} value={totalInternalParkingDuration}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.external_parking'} />} value={totalExternalParkingDuration}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.department'} />} value={totalWorkPostParkingDuration}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.test_drive'} />} value={totalOtherParkingDuration}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.total'} />} value={totalParkingDuration}/>

                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.plan'} />} value={totalPlanPerfomance}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.department'} />} value={totalDepartmentPerfomance}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.station'} />} value={totalStationPerfomance}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.total_rows'} />} value={totalRowsCount}/>
                </div>
            </div>
        );
    }
}