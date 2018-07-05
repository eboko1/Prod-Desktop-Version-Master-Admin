// vendor
import React, { Component } from 'react';
import { Modal, Form, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Select } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, setUniversalFilters } from 'core/orders/duck';

import { DecoratedSelect, DecoratedDatePicker } from 'forms/DecoratedFields';
import { StatsCountsPanel } from 'components';
import { UniversalFiltersForm } from 'forms';
import { withReduxForm, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const FormItem = Form.Item;

// const dateFormat = 'YYYY-MM-DD';

// @withReduxForm({
//     name:    'universalFiltersForm',
//     actions: {
//         change: onChangeUniversalFiltersForm,
//         fetchOrders,
//         setUniversalFilters,
//     },
// })
export default class UniversalFiltersModal extends Component {
    state = {
        // Whether to apply loading visual effect for OK button or not
        confirmLoading: false,
    };

    render() {
        const {
            visible,
            handleUniversalFiltersModalSubmit,
            setUniversalFiltersModal,
            vehicleMakes,
            vehicleModels,
            stats,
            managers,
            employees,
            creationReasons,
            orderComments,
            services,
        } = this.props;

        // Parent Node which the selector should be rendered to.
        // Default to body. When position issues happen,
        // try to modify it into scrollable content and position it relative.
        // Example:
        // offical doc: https://codesandbox.io/s/4j168r7jw0
        // git issue: https://github.com/ant-design/ant-design/issues/8461
        // let modalContentDivWrapper = null;

        return (
            <Modal
                className={ Styles.universalFiltersModal }
                width={ '80%' }
                title={ <FormattedMessage id='universal_filters' /> }
                cancelText={ <FormattedMessage id='universal_filters.cancel' /> }
                okText={ <FormattedMessage id='universal_filters.submit' /> }
                wrapClassName={ Styles.ufmoldal }
                visible={ visible }
                onOk={ () => handleUniversalFiltersModalSubmit() }
                onCancel={ () => setUniversalFiltersModal(false) }
            >
                <StatsCountsPanel stats={ stats } />
                <UniversalFiltersForm
                    wrappedComponentRef={ this.props.wrappedComponentRef }
                    vehicleMakes={ vehicleMakes }
                    vehicleModels={ vehicleModels }
                    managers={ managers }
                    employees={ employees }
                    creationReasons={ creationReasons }
                    orderComments={ orderComments }
                    services={ services }
                    // onSubmit={ () => handleUniversalFiltersModalSubmit() }
                />
            </Modal>
        );
    }
}
