/*
This file contains functionality to crete analytics dropdowns.
It creates one header dropdown and it's subanalitics as well.
*/

//vendor
import React from 'react';
import { Collapse, Row, Col, Switch, Button, Icon } from 'antd';
import _ from 'lodash';

//proj
import {
    formKeys,
    formModes
} from 'core/forms/reportAnalyticsForm/duck';

//own
import Style from './styles.m.css';

const { Panel } = Collapse;

export default class AnalyticsDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    

    //Generate panel with all it's children components for one parent analytics
    genPanel(parent, children) {

        const {
            onDeleteAnalytics,
            openAnalyticsModal,
            onUpdateAnalytics
        } = this.props;

        const genParentHeader = (analytics) => {
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
                                            <Button size="large" onClick={() => onDeleteAnalytics(analytics.analyticsId)}> 
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

        const genChildren = (chil) => {
            return (
                <div className={Style.analyticsCont} key={chil.analyticsId}>
                    <Row className={Style.row}>
                        <Col className={Style.col} span={8}>{chil.analyticsName}</Col>

                        <Col className={Style.col} span={4}>{chil.analyticsBookkeepingAccount}</Col>
                        <Col className={Style.col} span={4}>{chil.analyticsOrderType}</Col>

                        <Col className={Style.colCentered} span={2}>
                            <Switch
                                size='small'
                                checked={!chil.analyticsDisabled}
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
                                    if(chil.analyticsIsCustom) {
                                        return (
                                            <Button size="small" onClick={() => onDeleteAnalytics(chil.analyticsId)}> 
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

        return (
            <Panel header={genParentHeader(parent)} key={parent.analyticsId}>
                {_.map(children, (o) => genChildren(o))}
            </Panel>
        )
        
    }

    render() {

        const {
            analytics
        } = this.props;

        /* Get only analytics with level 1 */
        const firstLevelAnal = analytics.filter(o => o.analyticsLevel == 1);

        return (
            <div className={Style.mainCont}>
                <Collapse defaultActiveKey={['1']}>
                    
                    {
                        _.map(firstLevelAnal, (obj) => {
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