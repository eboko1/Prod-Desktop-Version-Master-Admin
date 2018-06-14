import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

// existing custom component
// import CustomInput from '../path/to/custom-input-component';

// wrapper field
class ReactReduxForm extends Component {
    render() {
        let { model, dispatch } = this.props;

        return (
            <>
                <Form>
                    <FormItem label='First Name'>
                        <Input placeholder='input placeholder' />
                    </FormItem>
                    <FormItem label='Last Name'>
                        <Input placeholder='input placeholder' />
                    </FormItem>
                    <FormItem>
                        <Button type='primary'>Submit</Button>
                    </FormItem>
                </Form>
                <pre className='language-bash'>
                    { /* { JSON.stringify(fields, null, 2) } */ }
                </pre>
            </>
            // <CustomInput
            //     onCustomChange={ e => dispatch(actions.change(model, e)) }
            // />
        );
    }
}

// export default connect(s => s)(CustomField);
export default ReactReduxForm;

// Usage:
/* <MyCustomInput model='user.name' />; */
