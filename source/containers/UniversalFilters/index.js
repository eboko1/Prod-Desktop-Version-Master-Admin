// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button } from 'antd';

// proj
import {
    onChangeUniversalFiltersForm,
    fetchUniversalFiltersForm,
} from 'core/forms/universalFiltersForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';
import { UniversalFiltersTags } from 'components';
import { permissions, isForbidden } from 'utils';
import { withReduxForm2 } from 'utils';

// own
import Styles from './styles.m.css';

const universalLinkedFields = Object.freeze({
    notVisitRange: [ 'notVisit', 'notVisitDays' ],
});

const tagFields = Object.freeze([ 'createDate', 'beginDate', 'ordersGreater', 'ordersLower', 'managers', 'employee', 'service', 'models', 'make', 'creationReasons', 'cancelReasons', 'year', 'odometerLower', 'odometerGreater' ]);

@injectIntl
@withReduxForm2({
    name:    'universalFiltersForm',
    actions: {
        change: onChangeUniversalFiltersForm,
        fetchUniversalFiltersForm,
        setModal,
        resetModal,
    },
    mapStateToProps: state => ({
        universalFiltersModal: state.modals.modal,
        user:                  state.auth,
    }),
})
export default class UniversalFilters extends Component {
    // Contains: modal, show button, tags
    // Modal contains: form

    showUniversalFiltersModal = () => {
        this.props.setModal(MODALS.UNIVERSAL_FILTERS);
        this.props.fetchUniversalFiltersForm();
    };

    clearFilters = fieldNames => {
        this.props.form.resetFields(fieldNames);
        this.props.setUniversalFilter(this.props.form.getFieldsValue());
    };

    render() {
        const {
            user,
            resetModal,
            universalFiltersModal,
            setUniversalFilter,
            stats,
            form,
            filters,
        } = this.props;

        const areFiltersDisabled = isForbidden(user, permissions.SHOW_FILTERS);
        const formFilters = form.getFieldsValue();

        return (
            <Catcher>
                <section className={ Styles.filters }>
                    <Button
                        type='primary'
                        disabled={ areFiltersDisabled }
                        onClick={ () => this.showUniversalFiltersModal() }
                    >
                        <FormattedMessage id='universal-filters-container.filter' />
                    </Button>
                    <UniversalFiltersTags
                        universalLinkedFields={ universalLinkedFields }
                        tagFields={ tagFields }
                        filter={ formFilters }
                        clearUniversalFilters={ this.clearFilters }
                    />
                </section>
                <UniversalFiltersModal
                    { ...filters }
                    setUniversalFilter={ setUniversalFilter }
                    form={ form }
                    stats={ stats }
                    visible={ universalFiltersModal }
                    hideModal={ () => resetModal() }
                    resetModal={ () => {
                        this.props.form.setFieldsValue(
                            this.props.universalFilter,
                        );
                        resetModal();
                    } }
                />
            </Catcher>
        );
    }
}
