// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import {
    onChangeUniversalFiltersForm,
    fetchUniversalFiltersForm,
} from "core/forms/universalFiltersForm/duck";
import { setModal, resetModal, MODALS } from "core/modals/duck";

import { Catcher, StyledButton } from "commons";
import { UniversalFiltersModal } from "modals";
import { UniversalFiltersTags } from "components";
import { withReduxForm2 } from "utils";

// own
import Styles from "./styles.m.css";

const universalLinkedFields = Object.freeze({
    notVisitRange: ["notVisit", "notVisitDays"],
});

/* eslint-disable array-element-newline */
const tagFields = Object.freeze([
    "createDate",
    "beginDate",
    "ordersGreater",
    "ordersLower",
    "managers",
    "employee",
    "service",
    "models",
    "make",
    "creationReasons",
    "cancelReasons",
    "year",
    "odometerLower",
    "odometerGreater",
]);
/* eslint-enable array-element-newline */

@injectIntl
@withReduxForm2({
    name: "universalFiltersForm",
    actions: {
        change: onChangeUniversalFiltersForm,
        fetchUniversalFiltersForm,
        setModal,
        resetModal,
    },
    mapStateToProps: state => ({
        universalFiltersModal: state.modals.modal,
        user: state.auth,
    }),
})
export default class UniversalFilters extends Component {
    // Contains: modal, show button, tags
    // Modal contains: form

    _showUniversalFiltersModal = () => {
        this.props.setModal(MODALS.UNIVERSAL_FILTERS);
        this.props.fetchUniversalFiltersForm();
    };

    clearFilters = fieldNames => {
        this.props.form.resetFields(fieldNames);
        this.props.setUniversalFilter(this.props.form.getFieldsValue());
    };

    render() {
        const {
            resetModal,
            universalFiltersModal,
            setUniversalFilter,
            stats,
            form,
            filters,
            areFiltersDisabled,
            style,
        } = this.props;

        const formFilters = form.getFieldsValue();

        return (
            <Catcher>
                <section className={Styles.filters} style={style}>
                    <UniversalFiltersTags
                        universalLinkedFields={universalLinkedFields}
                        tagFields={tagFields}
                        filter={formFilters}
                        clearUniversalFilters={this.clearFilters}
                    />
                    <StyledButton
                        type="secondary"
                        disabled={areFiltersDisabled}
                        onClick={this._showUniversalFiltersModal}
                    >
                        <FormattedMessage id="universal-filters-container.filter" />
                    </StyledButton>
                </section>
                <UniversalFiltersModal
                    {...filters}
                    setUniversalFilter={setUniversalFilter}
                    form={form}
                    stats={stats}
                    visible={universalFiltersModal}
                    hideModal={() => resetModal()}
                    resetModal={() => {
                        if (_.isEqual(this.props.universalFilter, {})) {
                            this.props.form.resetFields();
                        } else {
                            this.props.form.setFieldsValue(
                                this.props.universalFilter,
                            );
                        }
                        resetModal();
                    }}
                />
            </Catcher>
        );
    }
}
