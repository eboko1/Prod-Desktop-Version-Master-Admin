/*
This file contains functionality to crete analytics dropdowns.
It creates one header dropdown and it's subanalitics as well.
*/

//vendor
import React from 'react';
import { Collapse, Row, Col, Switch, Button, Icon } from 'antd';
import _ from 'lodash';

//proj

//own
import Style from './styles.m.css';

const { Panel } = Collapse;

export default class AnalyticsDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    //Generate panel with all it's children components for one parent analytics
    genPanel(parent, children) {
        // console.log("Parent: ", parent, '\n', "Cld: ", children);

        const genParentHeader = (ana) => {
            return (<div>
                {ana.analyticsName} {ana.analyticsId}
            </div>);
        }

        const genChildren = (chil) => {
            return (
                <div className={Style.analyticsCont}>
                    <Row className={Style.row}>
                        <Col className={Style.col} span={20}>{chil.analyticsName} {chil.nalalyticsId}</Col>
                        <Col className={Style.colCentered} span={2}><Switch size='small'/></Col>
                        <Col className={Style.colCentered} span={2}>
                            <Button size="small">
                                <Icon type="delete" />
                            </Button>
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
                <Collapse onChange={() => console.log('click')} defaultActiveKey={['1']}>
                    
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