/*
This file contains functionality to crete analytics dropdowns.
It creates one header dropdown and it's subanalitics as well.
*/

//vendor
import React from 'react';
import { Collapse, Row, Col, Switch, Button, Icon } from 'antd';
import { FormattedMessage, injectIntl } from "react-intl";
import _ from 'lodash';

//proj
import {
    formKeys,
    formModes
} from 'core/forms/reportAnalyticsForm/duck';

//own
import Style from './styles.m.css';

const { Panel } = Collapse;

@injectIntl
export default class AnalyticsDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Takes cash order type and returns Its UI representation(translation)
     * @param {*} status Cash order status(in that case analytics's status field which represents for which order it can be used)
     */
    orderStatusesMapper(status) {
        switch (status.toLowerCase()) {
            case 'income':
                return <FormattedMessage id="report_analytics_page.income_cash_order" />
            case 'expense':
                return <FormattedMessage id="report_analytics_page.expense_cash_order" />
            default:
                return "Error, incorrect cash order value: " + status
        }
    }

     /**
     * Generates block header using fields from analytics sush as "name".
     * @param {*} analytics Parent analytics
     */
    genParentHeader (analytics, containsAnalyticsWithDefaultCashOrderType) {
        const {
            onDeleteAnalytics,
            openAnalyticsModal,
        } = this.props;

        return (
            <div>
                <Row className={Style.row}>
                    <Col className={Style.colHeader} span={20}>{analytics.analyticsName}</Col>
                    <Col className={Style.colCentered} span={2}>
                        {
                            /* EDIT btn | Buttons only for non-custom fields otherwise just place an icon */
                            (() => {
                                if(analytics.analyticsIsCustom) {
                                    return (
                                        <Button size="large" onClick={() => openAnalyticsModal(formModes.EDIT, formKeys.catalogForm, analytics)}> 
                                            <Icon type="edit" />
                                        </Button>
                                    );
                                } else return "";
                            })()
                        }
                        
                    </Col>
                    <Col className={Style.colCentered} span={2}>
                        {
                            /* DELETE btn | Buttons only for non-custom fields in another case just place an icon */
                            (() => {
                                if(analytics.analyticsIsCustom) {
                                    return (
                                        <Button disabled={containsAnalyticsWithDefaultCashOrderType} size="large" onClick={() => onDeleteAnalytics(analytics.analyticsId)}> 
                                            <Icon type="delete" />
                                        </Button>
                                    );
                                } else return (<Icon type="global" />);
                            })()
                        }
                        
                    </Col>
                </Row>
            </div>
        );
    }

    /**
     * Generate children analytics block
     * @param {*} chil children analytics
     */
    genChildren(chil) {
        const {
            onDeleteAnalytics,
            openAnalyticsModal,
            onUpdateAnalytics
        } = this.props;

        return (
            <div className={Style.analyticsCont} key={chil.analyticsId}>
                <Row className={Style.row}>
                    <Col className={Style.col} span={6}>{chil.analyticsName}</Col>

                    <Col span={2}>
                        {chil.analyticsDefaultOrderType=='INCOME' && (<Icon type="check" style={{color: 'green', fontSize: '1em'}}/>)}
                        {chil.analyticsDefaultOrderType=='EXPENSE' && (<Icon type="check" style={{color: 'red', fontSize: '1em'}} />)}
                        {!chil.analyticsDefaultOrderType && (
                            <div
                                className={Style.notDefaultAnalyticsIcon}
                                onClick={() => {
                                    //Update anlytics by setting it up to be a default for a specific cash order type
                                    onUpdateAnalytics({
                                        analyticsId: chil.analyticsId,
                                        newAnalyticsEntity: {makeDefaultForCurrentCashOrderType: true}
                                    });
                                }}
                            />
                        )}
                    </Col>
                    <Col className={Style.col} span={4}>{chil.analyticsBookkeepingAccount}</Col>
                    <Col className={Style.col} span={4}>{this.orderStatusesMapper(chil.analyticsOrderType)}</Col>

                    <Col className={Style.colCentered} span={2}>
                        <Switch
                            size='small'
                            checked={!chil.analyticsDisabled}
                            disabled={ !_.isEmpty(chil.analyticsDefaultOrderType)} //Disable if analytics is default somewhere
                            onClick={() => {
                                //Update anlytics by changing ist's "disabled" value prop
                                onUpdateAnalytics({
                                    analyticsId: chil.analyticsId,
                                    newAnalyticsEntity: {analyticsDisabled: !chil.analyticsDisabled}
                                });
                            }}
                        />
                    </Col>
                    <Col className={Style.colCentered} span={2}>
                        {
                            /* VIEW btn | Buttons only for non-custom fields otherwise just place an icon */
                            (() => {
                                if(chil.analyticsIsCustom) {
                                    return (
                                        <Button size="small" onClick={() => openAnalyticsModal(formModes.VIEW, formKeys.analyticsForm, chil)}> 
                                            <Icon type="eye" />
                                        </Button>
                                    );
                                } else return "";
                            })()
                        }
                        
                    </Col>
                    <Col className={Style.colCentered} span={2}>
                        {
                            /* EDIT btn | Buttons only for non-custom fields otherwise just place an icon */
                            (() => {
                                if(chil.analyticsIsCustom) {
                                    return (
                                        <Button size="small" onClick={() => openAnalyticsModal(formModes.EDIT, formKeys.analyticsForm, chil)}> 
                                            <Icon type="edit" />
                                        </Button>
                                    );
                                } else return "";
                            })()
                        }
                        
                    </Col>
                    <Col className={Style.colCentered} span={2}>
                        {
                            /* DELETE btn | Buttons only for non-custom fields in another case just place an icon */
                            (() => {
                                if(chil.analyticsIsCustom ) {
                                    return (
                                        <Button
                                            size="small"
                                            onClick={() => onDeleteAnalytics(chil.analyticsId)}
                                            disabled={ !_.isEmpty(chil.analyticsDefaultOrderType)} //Disable if analytics is default somewhere
                                        > 
                                            <Icon type="delete" />
                                        </Button>
                                    );
                                } else return (<Icon type="global" />);
                            })()
                        }
                        
                    </Col>
                </Row>
                
            </div>
        );
    }

    

    /**
     * Generate panel with all it's children components for one parent analytics
     * @param {*} parent parent analytics
     * @param {*} children children analytics
     */
    genPanel(parent, children) {

        //Check if paret has default analyticst inside it(it means analytics which are default for a specific cash order type)
        const containsAnalyticsWithDefaultCashOrderType = !_.isEmpty(_.filter(children, chil => chil.analyticsDefaultOrderType));

        return (
            <Panel header={this.genParentHeader(parent, containsAnalyticsWithDefaultCashOrderType)} key={parent.analyticsId}>
                {_.map(children, (o) => this.genChildren(o))}
            </Panel>
        )
    }

    render() {

        const {
            analytics
        } = this.props;

        /* Get only analytics with level 1 */
        const firstLevelAnalytics = analytics.filter(o => o.analyticsLevel == 1);

        return (
            <div className={Style.mainCont}>
                <Collapse defaultActiveKey={['1']}>
                    
                    {
                        _.map(firstLevelAnalytics, (obj) => {
                            /* For each analytics with level 1 get all items wich has a parentId equal to ID of a current analytics */
                            const children = analytics.filter(o2 => o2.analyticsParentId == obj.analyticsId);
                            return this.genPanel(obj, children);
                        })
                            
                    }

                </Collapse>
            </div>
        );
    }
}