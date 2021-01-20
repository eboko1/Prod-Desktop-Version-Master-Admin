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

    showStats(stats) {

        const {
            totalRowsCount,
            totalServicesSum,
            totalAppurtenanciesSum,
            totalServicesProfit,
            totalAppurtenanciesProfit,
        } = stats;

        const totalSum = (parseInt(totalServicesSum) + parseInt(totalAppurtenanciesSum));
        const totalProfit = (parseInt(totalServicesProfit) + parseInt(totalAppurtenanciesProfit));

        const totalLaborsMargin = (Number(totalServicesSum) && Number(totalServicesProfit))
            ? ((totalServicesProfit*100.0)/totalServicesSum).toFixed(1)
            : 0;

        const totalAppurtenanciesMargin = (Number(totalAppurtenanciesProfit) && Number(totalAppurtenanciesSum))
        ?((totalAppurtenanciesProfit*100.0)/totalAppurtenanciesSum).toFixed(1)
        : 0;

        const totalMargin = (totalProfit && totalSum)
            ? (((totalProfit)/(totalSum))* 100.0).toFixed(1)
            : 0;

        return <div className={Styles.statsMainCont}>
            <div className={Styles.statsCont}>
                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.labors_sum'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalServicesSum)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.parts_sum'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalAppurtenanciesSum)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_sum'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalSum)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.labors_profit'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalServicesProfit)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.parts_profit'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalAppurtenanciesProfit)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_profit'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalProfit)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.labors_margin'} /></div>
                    <div className={Styles.statsText}>{totalLaborsMargin}</div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.parts_margin'} /></div>
                    <div className={Styles.statsText}>{totalAppurtenanciesMargin}</div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_margin'} /></div>
                    <div className={Styles.statsText}>{totalMargin}</div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_rows'} /></div>
                    <div className={Styles.statsText}><Numeral>{totalRowsCount}</Numeral></div>
                </div>
            </div>
        </div>
    }

    render() {

        const {
            stats
        } = this.props;

        return (
            this.showStats(stats)
        );
    }
}