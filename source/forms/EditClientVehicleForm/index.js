// vendor
import React, { Component } from 'react';
import { Button, List, Form, Row, Col, Select, notification } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { withReduxForm2 } from 'utils';
import { DecoratedInput, DecoratedCheckbox } from 'forms/DecoratedFields';
import {
    onChangeClientVehicleForm,
    setEditableItem,
    handleError,
} from 'core/forms/editClientVehicleForm/duck';

// own
import Styles from './styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;

const openNotificationWithIcon = (type, message, description) => {
    notification[ type ]({
        message,
        description,
    });
};

@injectIntl
@withReduxForm2({
    name:    'clientVehicleForm',
    actions: {
        change: onChangeClientVehicleForm,
        setEditableItem,
        handleError,
    },
})
export class EditClientVehicleForm extends Component {
    constructor(props) {
        super(props);

        this.apiErrorsMap = {
            REFERENCE_VIOLATION: props.intl.formatMessage({
                id: 'REFERENCE_VIOLATION',
            }),
        };
    }

    render() {
        const { clientEntity, editableItem, clientId, errors } = this.props;

        if (errors.length) {
            const currentComponentErrors = errors.filter(({ response }) =>
                _.keys(this.apiErrorsMap).includes(_.get(response, 'message')));

            currentComponentErrors.forEach(componentError => {
                const description = this.apiErrorsMap[
                    componentError.response.message
                ];

                openNotificationWithIcon(
                    'error',
                    this.props.intl.formatMessage({
                        id: 'package-container.error',
                    }),
                    description,
                );
                this.props.handleError(componentError.id);
            });
        }

        return (
            <List
                size='small'
                bordered
                dataSource={ clientEntity.vehicles }
                renderItem={ (item, index) => (
                    <List.Item className={ Styles.listItem }>
                        <Form>
                            <Row gutter={ 8 } type='flex' align='bottom'>
                                <Col span={ 8 }>{ `${item.make} ${
                                    item.model
                                }` }</Col>
                                <Col span={ 2 }>
                                    <DecoratedCheckbox
                                        field={ `clientVehicles[${index}].enabled` }
                                        initialValue={ !item.disabled }
                                        disabled={ editableItem !== index }
                                        getFieldDecorator={
                                            this.props.form.getFieldDecorator
                                        }
                                    />
                                </Col>
                                <Col span={ 4 }>
                                    { editableItem === index ? (
                                        <DecoratedInput
                                            field={ `clientVehicles[${index}].number` }
                                            initialValue={ item.number }
                                            rules={ [
                                                {
                                                    required: true,
                                                    message:  this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'required_field',
                                                        },
                                                    ),
                                                },
                                            ] }
                                            hasFeedback
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                    ) : 
                                        item.number
                                    }
                                </Col>
                                <Col span={ 4 }>
                                    { editableItem === index ? (
                                        <DecoratedInput
                                            field={ `clientVehicles[${index}].vin` }
                                            initialValue={ item.vin }
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                    ) : 
                                        item.vin
                                    }
                                </Col>
                                <Col span={ 3 }>
                                    { editableItem === index ? (
                                        <Button
                                            onClick={ () => {
                                                const payload = this.props.form.getFieldValue(
                                                    `clientVehicles[${index}]`,
                                                );
                                                this.props.updateClientVehicle(
                                                    item.id,
                                                    clientId,
                                                    payload,
                                                );

                                                this.props.setEditableItem(
                                                    null,
                                                );
                                            } }
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={ () =>
                                                this.props.setEditableItem(
                                                    index,
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                    ) }
                                </Col>
                                <Col span={ 3 }>
                                    <Button
                                        onClick={ () =>
                                            this.props.deleteClientVehicle(
                                                clientId,
                                                item.id,
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </List.Item>
                ) }
            />
        );
    }
}
