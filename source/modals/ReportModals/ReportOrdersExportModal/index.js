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

const FItem = Form.Item;
const RGroup = Radio.Group;

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
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={1} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={2} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={3} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={4} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={5} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={6} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={7} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={8} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={9} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={10} /></Col></Row>
                <Row className={Styles.row}><Col className={Styles.col} span={24}><Radio value={11} /></Col></Row>
            </RGroup>
        );
    }

    generateCheckbox(text) {
        return (
            <Row className={Styles.row}>
                <Col className={Styles.col} span={6}><Checkbox /></Col>
                <Col span={18}>{text}</Col>
            </Row>
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
        const generateCheckbox = this.generateCheckbox;
        
        return (
            <Modal
                width={ '85%' }
                visible={ visible === MODALS.REPORT_ORDERS_EXPORT }
                onOk={ onOk }
                onCancel={ onCancel }
            >
                <Form>
                    <Row>
                        <Col span={12}>
                            
                            {generateCheckbox('Creation date')}
                            {generateCheckbox('Appointment date')}
                            {generateCheckbox('Done date')}
                            {generateCheckbox('Service advisors')}
                            {generateCheckbox('Mechanics')}
                            {generateCheckbox('Purchase manager')}
                            {generateCheckbox('Posts')}
                            {generateCheckbox('Statuses')}
                            {generateCheckbox('Requisites')}
                            {generateCheckbox('Clients')}
                            {generateCheckbox('Nothing')}
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