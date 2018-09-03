// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form } from 'antd';

// proj
import { DecoratedInput } from 'forms/DecoratedFields';

// own
const FormItem = Form.Item;

class ArrayInput extends Component {
    constructor(props) {
        super(props);

        this.uuid = 0;
        const keys = props.optional ? [] : [ this.uuid++ ];
        this.state = {
            keys,
        };
    }

    remove = key => {
        const {
            optional,
            // form: { getFieldValue, setFieldsValue },
        } = this.props;

        //const keys = getFieldValue(`${this.props.fieldName}Keys`);
        const keys = this.state.keys;
        if (keys.length === 1 && !optional) {
            return;
        }

        this.setState({ keys: keys.filter(value => value !== key) });
        // setFieldsValue({
        //     [ `${this.props.fieldName}Keys` ]: keys.filter(
        //         value => value !== key,
        //     ),
        // });
    };

    add = () => {
        // const keys = this.props.form.getFieldValue(
        //     `${this.props.fieldName}Keys`,
        // );
        // this.props.form.setFieldsValue({
        //     [ `${this.props.fieldName}Keys` ]: [ ...keys, uuid++ ],
        // });
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { fieldName, fieldTitle, rules, optional } = this.props;

        // getFieldDecorator(`${fieldName}Keys`, {
        //     initialValue: optional ? [] : [ 0 ],
        // });
        //const keys = getFieldValue(`${fieldName}Keys`);
        const keys = this.state.keys;

        const formItems = keys.map(key => {
            return (
                <Row type='flex' align='middle' key={ key }>
                    <Col span={ 20 }>
                        <DecoratedInput
                            hasFeedback
                            formItem
                            label={ fieldTitle }
                            getFieldDecorator={ getFieldDecorator }
                            key={ key }
                            field={ `${fieldName}[${key}]` }
                            rules={ rules }
                        />
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='center'>
                            { keys.length > 1 || optional ? (
                                <Icon
                                    key={ key }
                                    className='dynamic-delete-button'
                                    type='minus-circle-o'
                                    style={ { fontSize: 20, color: '#cc1300' } }
                                    disabled={ keys.length === 1 }
                                    onClick={ () => this.remove(key) }
                                />
                            ) : null }
                        </Row>
                    </Col>
                </Row>
            );
        });

        return (
            <Col>
                { formItems }
                <Row type='flex'>
                    <Col span={ 20 }>
                        <Row type='flex' justify='center'>
                            <FormItem>
                                <Button type='dashed' onClick={ this.add }>
                                    <Icon type='plus' /> { this.props.buttonText }
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default ArrayInput;
