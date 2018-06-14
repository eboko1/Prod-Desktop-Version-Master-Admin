import React, { Component } from 'react';
// import { connect } from 'react-redux';
//
// import { formsActions } from 'core/forms/formikForm/actions';
// import { profileSelector } from 'core/forms/formikForm/reducer';
// import { withFormik, Form, Field } from 'formik';
// const Yup = require('yup');
import { Formik } from 'formik';
import { Button, Input, Form } from 'antd';
const FormItem = Form.Item;
//
// const mapStateToProps = state => {
//     // console.log('profile', profileSelector(state));
//
//     return {
//         profile: profileSelector(state),
//     };
// };
//
// const mapDispatchToProps = {
//     setFirstName: formsActions.setFirstName,
// };

// @connect(mapStateToProps, { ...formsActions })
// @connect(mapStateToProps, mapDispatchToProps)
export class FormikForm extends Component {
    // handleSubmit(values) {
    //     //{ setSubmitting }
    //     console.log('val', values);
    //     console.log('FORMsubProps', this.props);
    //     this.props.setFirstName(values);
    //     // setSubmitting(false);
    //     // resetForm();
    // }

    render() {
        const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            name,
            profile,
            onSubmit,
        } = this.props;

        // const props = this.props;

        // const firstName = this.props.profile.firstName;

        return (
            <Formik
                initialValues={ { name: name } }
                validate={ values => !values.name && { name: 'Name isRequired' } }
                // onSubmit={ () => this.props.onSubmit(values) }
                // onSubmit={ onSubmit }
                onSubmit={ values => {
                    console.log('onSubmitvaluuuuues', values);
                    onSubmit(values.name);
                } }
                // render={ form => (
                render={ ({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    handleReset,
                }) => (
                    <Form onSubmit={ handleSubmit }>
                        { console.log('__props__', this.props) }

                        <Form.Item
                            name='name'
                            label='Name'
                            hasFeedback={ !!errors.name }
                            validateStatus={ errors.name && 'error' }
                            help={ errors.name }
                        >
                            { console.log('name', values.name) }
                            <Input
                                placeholder='Basic usage'
                                value={ values.name }
                                onChange={ event =>
                                    setFieldValue('name', event.target.value)
                                }
                                onBlur={ () => setFieldTouched(name) }
                                onPressEnter={ handleSubmit }
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                onClick={ () => handleReset() }
                                // disabled={ !form.dirty || form.isSubmitting }
                            >
                                Reset
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                // disabled={ form.isSubmitting }
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                ) }
            />
        );
    }
}

/* <Form onSubmit={ form.handleSubmit }>
    { console.log('--- form', form) }
    { console.log('__props__', this.props) }

    <Form.Item
        name='name'
        label='Name'
        hasFeedback={ !!form.errors[ name ] }
        validateStatus={ form.errors[ name ] && 'error' }
        help={ form.errors[ name ] }
    >
        { console.log('name', form.values.name) }
        <Input
            placeholder='Basic usage'
            value={ form.values.name }
            onChange={ event =>
                form.setFieldValue(
                    'name',
                    event.target.value,
                )
            }
            onBlur={ () => form.setFieldTouched(name) }
            onPressEnter={ form.handleSubmit }
        />
    </Form.Item>

    <Form.Item>
        <Button
            onClick={ () => form.handleReset() }
            // disabled={ !form.dirty || form.isSubmitting }
        >
            Reset
        </Button>
    </Form.Item>
    <Form.Item>
        <Button
            type='primary'
            htmlType='submit'
            // disabled={ form.isSubmitting }
        >
            Submit
        </Button>
    </Form.Item>
</Form> */
