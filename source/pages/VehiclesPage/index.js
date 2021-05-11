// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Input} from 'antd';
import _ from 'lodash';

// proj
import {Layout, Spinner} from 'commons';

// own
import Styles from './styles.m.css';
import Block from './components/Block';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclesPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout
                title={"Title here"}
                description={"Description"}
                controls={"Controls"}
            >
                <Tabs type="card" tabPosition="right" tabBarGutter={15}>
                    <TabPane tab="General info" key="general_info">
                        <div className={Styles.tabContent}>
                            <Block
                                title="My title"
                                controls={<div>
                                    <Icon type="dollar" />
                                    <Icon type="copy" />
                                </div>}
                            >
                                <div>My custom content item</div>
                            </Block>
                        </div>
                        

                    </TabPane>



                    <TabPane tab="Norm hours" key="norm_hours">Content 2</TabPane>
                    <TabPane tab="Orders" key="orders">Content 3</TabPane>
                    <TabPane tab="Labors" key="labors">Content 4</TabPane>
                    <TabPane tab="Spare parts" key="spare_parts">Content 5</TabPane>
                    <TabPane tab="Recommendations" key="recommendations">Content 6</TabPane>
                    {/* TODO: Change key */}
                    <TabPane tab="ТО и Интервали" key="inspection_intervals">Content 7</TabPane>
                </Tabs>
            </Layout>
        )
    }
}