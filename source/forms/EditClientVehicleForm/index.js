// vendor
import React, { Component } from 'react';
import { Button, Table, Icon, List, Form, Row, Col, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { withReduxForm2 } from 'utils';
import { DecoratedInput } from 'forms/DecoratedFields';
import { onChangeClientVehicleForm } from 'core/forms/editClientVehicleForm/duck';

// own
const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@withReduxForm2({
    name:    'clientVehicleForm',
    actions: {
        change: onChangeClientVehicleForm,
    },
})
export class EditClientVehicleForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { clientEntity } = this.props;

        return (
            <List
                size='small'
                bordered
                dataSource={ clientEntity.vehicles }
                renderItem={ (item, index) => (
                    <Row gutter={ 8 } type='flex' align='bottom'>
                        <Col span={ 10 }>
                            { `${item.make} ${item.model}` }
                        </Col>
                        <Col span={ 4 }>
                            <DecoratedInput
                                field={ `clientVehicles[${index}].number` }
                                initialValue={ item.number }
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id: 'required_field',
                                        }),
                                    },
                                ] }
                                hasFeedback
                                getFieldDecorator={ this.props.form.getFieldDecorator }
                            />
                        </Col>
                        <Col span={ 4 }>
                            <DecoratedInput
                                field={ `clientVehicles[${index}].vin` }
                                initialValue={ item.vin }
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id: 'required_field',
                                        }),
                                    },
                                ] }
                                hasFeedback
                                getFieldDecorator={ this.props.form.getFieldDecorator }
                            />
                        </Col>
                        <Col span={ 3 }>Edit</Col>
                        <Col span={ 3 }>Delete</Col>
                    </Row>
                ) }
            />
        );
    }
}
