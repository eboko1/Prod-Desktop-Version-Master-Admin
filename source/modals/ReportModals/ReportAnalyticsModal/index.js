// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Button, Col, Row, Checkbox, Radio, Tabs, Input, Select } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { getField } from 'react-redux-form';

// own
import Styles from './styles.m.css';

const FItem = Form.Item;
const RGroup = Radio.Group;
const CGroup = Checkbox.Group;
const TPane = Tabs.TabPane;

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
    setModal,
    resetModal,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class ReportAnalyticsModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {
            visible,
            onOk,
            onCancel,
            form
        } = this.props;

        const {
            getFieldDecorator
        } = form;
        
        return (
            <Modal
                width={ '80%' }
                visible={ visible === MODALS.REPORT_ANALYTICS }
                onOk={ onOk }
                onCancel={ onCancel }
                title={<div className={Styles.title}>Create analytics</div>}
                style={{height: '90vh'}}
            >
                <Form>

                    <Tabs tabPosition='left' tabBarStyle={{width: '20%'}}>

                        <TPane tab="Create catalog" key='0'>
                            <Row>
                                <Col span={6}>Catalog name: </Col>
                                <Col span={18}>
                                    <FItem>
                                        {
                                            getFieldDecorator('catalogName')(
                                                <Input />
                                            )
                                        }
                                    </FItem>
                                </Col>
                            </Row>
                        </TPane>

                        <TPane tab="Create analytics" key='1'>
                            <Row>
                                <Col span={6}>Analytics name: </Col>
                                <Col span={18}>
                                    <FItem>
                                        {
                                            getFieldDecorator('analyticsName')(
                                                <Input />
                                            )
                                        }
                                    </FItem>
                                </Col>
                            </Row>
                            {/* ==================================================== */}
                            <Row>
                                <Col span={6}>Bookkeeping account: </Col>
                                <Col span={18}>
                                    <FItem>
                                        {
                                            getFieldDecorator('bookkeepingAccount')(
                                                <Input />
                                            )
                                        }
                                    </FItem>
                                </Col>
                            </Row>
                            {/* ==================================================== */}
                            <Row>
                                <Col span={6}>Order type: </Col>
                                <Col span={18}>
                                    <FItem>
                                        {
                                            getFieldDecorator('orderType')(
                                                <Select />
                                            )
                                        }
                                    </FItem>
                                </Col>
                            </Row>
                        </TPane>

                    </Tabs>

                </Form>
            </Modal>
        );
    }
}

export default Form.create({name: 'report_analytics_modal_in_form'}) (
    ReportAnalyticsModal
)