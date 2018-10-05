// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, Icon } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';

// own
import { UniversalChartList } from './UniversalChartList';

@injectIntl
export default class UniversalChartModal extends Component {
    render() {
        const { visible, resetModal } = this.props;

        return (
            <Modal
                title='Выберите показатель для графика'
                visible={ visible === MODALS.UNIVERSAL_CHART }
                onCancel={ () => resetModal() }
                footer={ null }
            >
                Universal Chart Options
                <UniversalChartList />
            </Modal>
        );
    }
}
