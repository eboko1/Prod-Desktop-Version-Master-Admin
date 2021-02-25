/*
This file contains functionality to crete cash flow dropdowns.
It creates one header dropdown and its subobjects(children) blocks.
*/

//vendor
import React from 'react';
import { Collapse, Row, Col, Switch, Button, Icon } from 'antd';
import { FormattedMessage, injectIntl } from "react-intl";
import _ from 'lodash';

//proj
import { Numeral } from 'commons';
import { StatsPanel } from 'components'

//own
import Style from './styles.m.css';

const { Panel } = Collapse;

@injectIntl
export default class AnalyticsDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

     /**
     * Generates block header using fields from parent object sush as "name".
     * @param {*} analytics Parent object
     */
    genParentHeader (parent) {
        return (
            <div>
                <Row className={Style.row}>
                    <Col className={Style.colHeader} span={12}>{parent.analyticsName}</Col>

                    <Col className={Style.col} span={4}>
                        <Numeral mask='0,0.00'>{parent.totalIncreaseSum}</Numeral>
                    </Col>

                    <Col className={Style.col} span={4}>
                        <Numeral mask='0,0.00'>{parent.totalIncreaseSum}</Numeral>
                    </Col>

                    <Col className={Style.col} span={4}>
                        <Numeral mask='0,0.00'>{parent.totalIncreaseSum}</Numeral>
                    </Col>
                </Row>
            </div>
        );
    }

    /**
     * Generate children block
     * @param {*} chil children object
     */
    generateChildrenBlock(chil) {

        return (
            <div className={Style.analyticsCont} key={chil.analyticsUniqueId}>
                <Row className={Style.row}>
                    <Col className={Style.col} span={12}>{chil.analyticsName}</Col>

                    <Col className={Style.col} span={4}>
                        <Numeral mask='0,0.00'>{chil.totalIncreaseSum}</Numeral>
                    </Col>

                    <Col className={Style.col} span={4}>
                        <Numeral mask='0,0.00'>{chil.totalIncreaseSum}</Numeral>
                    </Col>

                    <Col className={Style.col} span={4}>
                        <Numeral mask='0,0.00'>{chil.totalIncreaseSum}</Numeral>
                    </Col>
                </Row>
            </div>
        );
    }

    

    /**
     * Generate panel with a header and all its children components
     * @param {*} parent parent component
     * @param {*} children children components
     */
    generatePanel(parent, children) {
        return (
            <Panel header={this.genParentHeader(parent)} key={parent.analyticsUniqueId} showArrow={false}>
                {_.map(children, (o) => this.generateChildrenBlock(o))}
            </Panel>
        )
    }

    getNormalizedStats(stats) {
        const normalizedStats = [
            {
                label: 'Total increase',
                value: stats.totalIncreaseSum,
            },
            {
                label: 'Total decrease',
                value: stats.totalDecreaseSum,
            },
            {
                label: 'Total balance',
                value: stats.totalBalance,
            }
        ];

        // console.log(stats);

        return normalizedStats;
    }

    render() {
        const {
            tableData,
            stats
        } = this.props;

        //Get default active keys, it is used to open all panels as init state
        let keys = _.reduce(tableData, (arr, obj) => {
            const newVal = _.get(obj, 'analyticsUniqueId', undefined);
            return [...arr, newVal]
        }, [])

        keys = _.compact(keys);

        const normalizedStats= this.getNormalizedStats(stats);

        return (
            <div className={Style.mainCont}>
                <div className={Style.statsCont}>
                    <StatsPanel extended stats={normalizedStats}/>
                </div>

                <div>
                    <Row className={Style.row}>
                        <Col className={[Style.col.toString(), Style.colHeader.toString()]} span={12}>Analytics name</Col>

                        <Col className={[Style.col.toString(), Style.colHeader.toString()]} span={4}>Increase</Col>

                        <Col className={[Style.col.toString(), Style.colHeader.toString()]} span={4}>Decrese</Col>

                        <Col className={[Style.col.toString(), Style.colHeader.toString()]} span={4}>Balance</Col>
                    </Row>
                </div>
                <Collapse activeKey={keys}>
                    {
                        _.map(tableData, (obj) => {
                            const children = obj.children; //Get children items
                            return this.generatePanel(obj, children);
                        })
                            
                    }
                </Collapse>
            </div>
        );
    }
}