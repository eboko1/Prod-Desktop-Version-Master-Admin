// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Button, Col, Row, Checkbox, Radio } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { getField } from 'react-redux-form';

// own
import Styles from './styles.m.css';
import reportFields from './constants';

const FItem = Form.Item;
const RGroup = Radio.Group;
const CGroup = Checkbox.Group;

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
class ReportOrdersExportModal extends Component {
    constructor(props) {
        super(props);
        // this.generateRadio = this.generateRadio.bind(this)
    }

    generateRadio() {
        return (
            <RGroup className={Styles.radioGroup}>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.creation_date} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.appointment_date} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.done_date} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.service_advisor} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.mechanic} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.purchase_manager} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.post} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.status} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.requisite} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.client} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={reportFields.nothing} /></Col></Row>
            </RGroup>
        );
    }

    generateCheckboxes() {

        const row = (value, label) => {
            return (
                <Row className={Styles.row}>
                    <Col className={Styles.col} span={6}><Checkbox value={value}/></Col>
                    <Col span={18}>{label}</Col>
                </Row>
            );
        }

        const labelRow = (label) =>  (
                <Row className={Styles.row}>
                    <Col className={Styles.col} span={6}></Col>
                    <Col span={18}>{label}</Col>
                </Row>
            );
        
        
        return (
            <CGroup style={{width: '100%'}}>
                {row(reportFields.creation_date, 'Creation date')}
                {row(reportFields.appointment_date, 'Appointmen date')}
                {row(reportFields.done_date, 'Done date')}
                {row(reportFields.service_advisor, 'Service advisor')}
                {row(reportFields.mechanic, 'Mechanic')}
                {row(reportFields.purchase_manager, 'Purchase manager')}
                {row(reportFields.post, 'Post')}
                {row(reportFields.status, 'Status')}
                {row(reportFields.requisite, 'Requisite')}
                {row(reportFields.client, 'Client')}
                {labelRow('Nothing')}
            </CGroup>
        );
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

        const generateRadio = this.generateRadio;
        const generateCheckboxes = this.generateCheckboxes;
        
        return (
            <Modal
                width={ '40%' }
                visible={ visible === MODALS.REPORT_ORDERS_EXPORT }
                onOk={ onOk }
                onCancel={ onCancel }
            >
                <Form>
                    <Row>
                        <Col span={12}>
                            <FItem>
                                {
                                    getFieldDecorator('reportFields', {

                                    })(
                                        generateCheckboxes()
                                    )
                                }
                            </FItem>
                        </Col>
                        {/* ==================================================== */}
                        <Col span={4}>
                            <FItem>
                            {
                                getFieldDecorator('groupingLevel1', {

                                })(
                                    generateRadio()
                                )
                            }
                            </FItem>
                        </Col>
                        {/* ==================================================== */}
                        <Col span={4}>
                            <FItem>
                            {
                                getFieldDecorator('groupingLevel2', {

                                })(
                                    generateRadio()
                                )
                            }
                            </FItem>
                        </Col>
                        {/* ==================================================== */}
                        <Col span={4}>
                            <FItem>
                            {
                                getFieldDecorator('groupingLevel3', {

                                })(
                                    generateRadio()
                                )
                            }
                            </FItem>
                        </Col>
                    </Row>
                    

                </Form>
            </Modal>
        );
    }
}



export default Form.create({name: 'report_orders_export_modal_in_form'}) (
    ReportOrdersExportModal
)