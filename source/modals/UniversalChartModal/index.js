// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, Icon } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';

@injectIntl
export default class UniversalChartModal extends Component {
    constructor(props) {
        super(props);

        const { formatMessage } = this.props.intl;

        this.chartOptions = [
            {
                title:   formatMessage({ id: 'mainKPI' }),
                options: [
                    {
                        label: formatMessage({ id: 'sales' }),
                        value: 'sales',
                    },
                    {
                        label: formatMessage({ id: 'avgCheck' }),
                        value: 'averageSales',
                    },
                    {
                        label: formatMessage({ id: 'postsLoad' }),
                        value: 'load',
                    },
                    {
                        label: formatMessage({ id: 'appointmentsToRepairs' }),
                        value: 'appointmentProgress',
                    },
                    {
                        label: formatMessage({ id: 'permanentClients' }),
                        value: 'permClients',
                    },
                    {
                        label: formatMessage({ id: 'overallNPS' }),
                        value: 'reviews',
                    },
                ],
            },
            {
                title:   formatMessage({ id: 'calls' }),
                options: [
                    {
                        label: formatMessage({ id: 'reactionTime' }),
                        value: 'callsReaction',
                    },
                    {
                        label: formatMessage({ id: 'frozenNew' }),
                        value: 'stackCalls',
                    },
                ],
            },
            {
                title:   formatMessage({ id: 'serviceLoad' }),
                options: [
                    {
                        label: formatMessage({ id: 'postsLoadAuto' }),
                        value: 'appointments',
                    },
                    {
                        label: formatMessage({ id: 'appointmentsQuantity' }),
                        value: 'appointment',
                    },
                    {
                        label: formatMessage({ id: 'approvesQuantity' }),
                        value: 'approve',
                    },
                    {
                        label: formatMessage({ id: 'repairsQuantity' }),
                        value: 'progress',
                    },
                ],
            },
            {
                title:   formatMessage({ id: 'conversion' }),
                options: [
                    {
                        label: formatMessage({ id: 'apointmentsToApproves' }),
                        value: 'appointmentApprove',
                    },

                    {
                        label: formatMessage({ id: 'approvesToRepairs' }),
                        value: 'approveProgress',
                    },
                    {
                        label: formatMessage({ id: 'invitationsToApproves' }),
                        value: 'inviteApprove',
                    },
                ],
            },
            {
                title:   formatMessage({ id: 'nps' }),
                options: [
                    {
                        label: formatMessage({ id: 'avgNPS' }),
                        value: 'reviews',
                    },

                    {
                        label: formatMessage({ id: 'serviceQuality' }),
                        value: 'serviceQuality',
                    },
                ],
            },
        ];
    }

    render() {
        const { modal: visible, resetModal } = this.props;

        return (
            <Modal
                title={ <Icon type='home' /> }
                visible={ visible === MODALS.SWITCH_BUSINESS }
                onCancel={ () => resetModal() }
                footer={ null }
            >
                Options
            </Modal>
        );
    }
}
