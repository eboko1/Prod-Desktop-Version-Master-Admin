// vendor
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

export default class UniversalFiltersModal extends Component {
    state = {
        // Whether to apply loading visual effect for OK button or not
        confirmLoading: false,
    };

    handleChange = value => console.log('→ Select a person value', value);

    render() {
        const { show, visible } = this.props;

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
                { /* <Select
                    showSearch
                    style={ { width: 200 } }
                    placeholder='Select a person'
                    optionFilterProp='children'
                    onChange={ value => this.handleChange(value) }
                    // onFocus={ handleFocus }
                    // onBlur={ handleBlur }
                    filterOption={ (input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option value='jack'>Jack</Option>
                    <Option value='lucy'>Lucy</Option>
                    <Option value='tom'>Tom</Option>
                </Select> */ }
                <Select
                    defaultValue='lucy'
                    style={ { width: 120 } }
                    onChange={ value => this.handleChange(value) }
                >
                    <Option value='jack'>Jack</Option>
                    <Option value='lucy'>Lucy</Option>
                    <Option value='disabled' disabled>
                        Disabled
                    </Option>
                    <Option value='Yiminghe'>yiminghe</Option>
                </Select>
            </Modal>
        );
    }
}
