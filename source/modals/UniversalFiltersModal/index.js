// vendor
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';

// proj
import { universalFiltersModalActions } from 'core/forms/antdReduxForm/actions';

import { StatsCountsPanel } from 'components';
// import { UniversalFiltersForm } from 'forms';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

// const mapStateToProps = (state, props) => {
//     return {
//         stats: state.
//     }
// }
//
// @connect(mapStateToProps, { })
// @withReduxForm({
//     name:    'universalFilters',
//     fields:  [ 'make' ],
//     actions: { change: universalFiltersModalActions.change },
// })
export default class UniversalFiltersModal extends Component {
    state = {
        // Whether to apply loading visual effect for OK button or not
        confirmLoading: false,
    };

    handleChange = value => console.log('→ Select a person value', value);

    render() {
        const { show, visible } = this.props;

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
                    <div>
                        <div>daterange row</div>
                        { /* <div> */ }

                        { /* <UniversalFiltersForm /> */ }
                        { /* <Select
                                showSearch
                                style={ { width: 200 } }
                                placeholder='Select a person'
                                optionFilterProp='children'
                                onChange={ value => this.handleChange(value) }
                                getPopupContainer={ () => modalContentDivWrapper }
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
                            </Select>
                        </div> */ }
                        <div>
                            <Select
                                showSearch
                                style={ { width: 200 } }
                                placeholder='Select a service'
                                optionFilterProp='children'
                                onChange={ value => this.handleChange(value) }
                                getPopupContainer={ () => modalContentDivWrapper }
                                // getPopupContainer={ () => modalContentDivWrapper }
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
                            </Select>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
