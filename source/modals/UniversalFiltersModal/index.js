// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';

import { UniversalFiltersForm } from 'forms';
import { StatsCountsPanel } from 'components';

// own
import Styles from './styles.m.css';

export default class UniversalFiltersModal extends Component {
    state = {
        // Whether to apply loading visual effect for OK button or not
        confirmLoading: false,
    };

    render() {
        const {
            visible,

            // Actions
            resetModal,

            // Filters
            vehicleMakes,
            vehicleModels,
            managers,
            employees,
            creationReasons,
            orderComments,
            services,

            // Modal stats
            stats,

            form,
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
                visible={ visible === MODALS.UNIVERSAL_FILTERS }
                onOk={ () => {
                    this.props.setUniversalFilter(
                        this.props.form.getFieldsValue(),
                    );
                    // hideModal();
                } }
                onCancel={ () => resetModal() }
                maskClosable={false}
            >
                <StatsCountsPanel stats={ stats } />
                <UniversalFiltersForm
                    form={ form }
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
