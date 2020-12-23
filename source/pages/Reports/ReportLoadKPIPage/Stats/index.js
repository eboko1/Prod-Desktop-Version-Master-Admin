/*
    This component shows stats
*/

//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";

//proj
import { Layout, Numeral } from "commons";

//own
import Styles from './styles.m.css';

export default class Stats extends React.Component {
    constructor(props) {
        super(props);
    }

    statsBlockComp(args) {
        const {title, content} = args;
        return (
            <div className={Styles.statsBlock}>
                <div className={Styles.statsHeader}>{title}</div>
                <div className={Styles.statsText}><Numeral>{parseInt(content)}</Numeral></div>
            </div>
        );
    }

    render() {

        const StatsBlock = this.statsBlockComp;

        return (
            <div className={Styles.statsMainCont}>
                <div className={Styles.statsCont}>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.planner'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.labors_plan'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.labors_actual'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.breaks'} />} content={1234}/>

                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.internal_parking'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.external_parking'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.department'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.test_drive'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.total'} />} content={1234}/>

                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.plan'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.department'} />} content={1234}/>
                    <StatsBlock title={<FormattedMessage id={'report_load_kpi_page.station'} />} content={1234}/>
                </div>
            </div>
        );
    }
}