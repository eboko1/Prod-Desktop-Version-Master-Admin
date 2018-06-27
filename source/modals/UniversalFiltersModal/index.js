// vendor
import React, { Component } from 'react';
import { Modal, Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';
import { v4 } from 'uuid';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, setUniversalFilters } from 'core/orders/duck';

import { StatsCountsPanel } from 'components';
// import { UniversalFiltersForm } from 'forms';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const FormItem = Form.Item;

@withReduxForm({
    name:    'universalFiltersForm',
    actions: {
        change: onChangeUniversalFiltersForm,
        fetchOrders,
        setUniversalFilters,
    },
})
export default class UniversalFiltersModal extends Component {
    state = {
        // Whether to apply loading visual effect for OK button or not
        confirmLoading: false,
    };

    handleChange = value => console.log('→ Select value', value);

    handleSubmit = e => {
        e.preventDefault();
        this.props.show(false);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(
                    'Received values of UniversalFiltersForm: ',
                    values,
                );
                this.props.setUniversalFilters({ ...values });
                this.props.fetchOrders(this.props.filter);
            }
        });
    };

    render() {
        const { show, visible, vehicleMakes, vehicleModels } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;
        // console.log('→ getFieldDecorator', getFieldDecorator);
        // Parent Node which the selector should be rendered to.
        // Default to body. When position issues happen,
        // try to modify it into scrollable content and position it relative.
        // Example:
        // offical doc: https://codesandbox.io/s/4j168r7jw0
        // git issue: https://github.com/ant-design/ant-design/issues/8461
        let modalContentDivWrapper = null;

        return (
            <Modal
                className={ Styles.universalFiltersModal }
                width={ '80%' }
                title=<FormattedMessage id='universal_filters' />
                cancelText={ <FormattedMessage id='universal_filters.cancel' /> }
                okText={ <FormattedMessage id='universal_filters.submit' /> }
                wrapClassName={ Styles.ufmoldal }
                visible={ visible }
                onOk={ () => show(false) }
                onCancel={ () => show(false) }
            >
                <div
                    style={ { height: 600 } }
                    ref={ modal => {
                        modalContentDivWrapper = modal;
                    } }
                >
                    <StatsCountsPanel stats={ this.props.stats } />
                    <Form layout='vertical' onSubmit={ this.handleSubmit }>
                        <FormItem label='make'>
                            { /* { getFieldDecorator('vehicleMakes', {
                                rules: [
                                    {
                                        required: true,
                                        message:  'vehicleMakes is required!',
                                    },
                                ],
                            })( */ }
                            { getFieldDecorator('make')(
                                <Select
                                    showSearch
                                    style={ { width: 200 } }
                                    placeholder='Select vehicle model'
                                    optionFilterProp='children'
                                    // key={ v4() }
                                    // onSelect={ value => this.handleChange(value) }
                                    onChange={ value => this.handleChange(value) }
                                    getPopupContainer={ () =>
                                        modalContentDivWrapper
                                    }
                                    filterOption={ (input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    { vehicleMakes.map(make => (
                                        <Option value={ make.makeId } key={ v4() }>
                                            { make.makeName }
                                        </Option>
                                    )) }
                                </Select>,
                            ) }
                        </FormItem>
                        <FormItem>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}
