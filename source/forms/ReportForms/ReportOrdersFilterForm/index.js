//vendor
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ReportOrdersFilter extends React.Component {
  componentDidMount() {
    // To disable submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const {
        filter
    } = this.props;
    console.log(filter, filter.creationFromDate.toString());

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
        <Form layout="inline" onSubmit={this.handleSubmit}>
            <div style={{backgroundColor: 'grey', height: '100%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{backgroundColor: 'red'}}>
                    <Row>
                        <Col span={6}>Creation</Col>
                        <Col span={2}>from</Col>
                        <Col span={6}><DatePicker defaultValue={moment(filter.creationFromDate.toString(), 'YYYY/MM/DD')} format={"YYYY/MM/DD"}/></Col>
                        <Col span={2}>to</Col>
                        <Col span={6}><DatePicker /></Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row>
                        <Col span={6}>Creation</Col>
                        <Col span={2}>from</Col>
                        <Col span={6}><DatePicker /></Col>
                        <Col span={2}>to</Col>
                        <Col span={6}><DatePicker /></Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row>
                        <Col span={6}>Creation</Col>
                        <Col span={2}>from</Col>
                        <Col span={6}><DatePicker /></Col>
                        <Col span={2}>to</Col>
                        <Col span={6}><DatePicker /></Col>
                        <Col span={2}></Col>
                    </Row>
                </div>
                <div style={{backgroundColor: 'green'}}>Test</div>
                <div style={{backgroundColor: 'blue'}}>Test</div>
            </div>

            {/* <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
                })(
                    <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                    />,
                )}
            </Form.Item>
            <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                    />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                Log in
                </Button>
            </Form.Item> */}
        </Form>
    );
  }
}

export const ReportOrdersFilterForm = Form.create()(ReportOrdersFilter);