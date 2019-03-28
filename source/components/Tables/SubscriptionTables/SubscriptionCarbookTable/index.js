// vendor
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import _ from "lodash";
import moment from "moment";

// proj
import {
    fetchSubscriptionSuggestions,
    setSubscriptionSuggestionsFilters,
    selectSubscriptionSuggestions,
    SUBSCRIPTION_TYPES,
} from "core/payments/duck";

import { DatePickerField } from "forms/_formkit";
import { ResponsiveView, StyledButton } from "commons";
import { BREAKPOINTS, linkTo } from "utils";
import book from "routes/book";

// own
import { columnsConfig } from "./config";
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    suggestions: selectSubscriptionSuggestions(state),
});

const mapDispatchToProps = {
    fetchSubscriptionSuggestions,
    setSubscriptionSuggestionsFilters,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class SubscriptionCarbookTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    componentDidMount() {
        this.props.fetchSubscriptionSuggestions(
            SUBSCRIPTION_TYPES.SUGGESTION_GROUP,
        );
    }

    // _onDateRangeChange = value => {
    //     const normalizedValue = value.map(date => date.format("YYYY-MM-DD"));
    //     const daterange = {
    //         startDatetime: normalizedValue[0],
    //         endDatetime: normalizedValue[1],
    //     };
    //     this.props.setSubscriptionSuggestionsFilters(daterange);
    //     this.props.fetchSubscriptionSuggestions(
    //         SUBSCRIPTION_TYPES.SUGGESTION_GROUP,
    //     );
    // };

    _handleDatePicker = date => {
        this.props.setSubscriptionSuggestionsFilters({
            startDatetime: moment(date).format("YYYY-MM-DD"),
        });
        this.props.fetchSubscriptionSuggestions(
            SUBSCRIPTION_TYPES.SUGGESTION_GROUP,
        );
    };

    render() {
        const { suggestions } = this.props;

        const pagination = {
            pageSize: 10,
            size: "large",
            total: Math.ceil(suggestions.stats.count / 10) * 10,
            hideOnSinglePage: true,
            current: suggestions.filters.page,
            onChange: page => {
                this.props.setSubscriptionSuggestionsFilters({ page });
                this.props.fetchSubscriptionSuggestions(
                    SUBSCRIPTION_TYPES.SUGGESTION_GROUP,
                );
            },
        };

        return (
            <div className={Styles.tableWrapper}>
                <div className={Styles.tableHead}>
                    <ResponsiveView
                        view={{ min: BREAKPOINTS.xxl.min, max: null }}
                    >
                        <h3 className={Styles.tableHeadText}>
                            <FormattedMessage id="subscription-table.advertise" />
                        </h3>
                    </ResponsiveView>
                    {/* <RangePickerField
                        onChange={this._onDateRangeChange}
                        // loading={ loading }
                        startDate={_.get(suggestions, "filters.startDatetime")}
                        endDate={_.get(suggestions, "filters.endDatetime")}
                    /> */}
                    <DatePickerField
                        date={moment(
                            _.get(suggestions, "filters.startDatetime"),
                        )}
                        onChange={this._handleDatePicker}
                        className={Styles.datePickerField}
                    />
                </div>
                <Table
                    className={Styles.table}
                    size="small"
                    columns={this.columns}
                    dataSource={_.get(suggestions, "list", [])}
                    // loading={cashboxesFetching}
                    pagination={pagination}
                    locale={{
                        emptyText: <FormattedMessage id="no_data" />,
                    }}
                />
                <Link
                    className={Styles.purchaseButton}
                    to={book.subscriptionPackagesPage}
                >
                    <StyledButton type="secondary">
                        <FormattedMessage id="subscription-table.buy_package" />
                    </StyledButton>
                </Link>
            </div>
        );
    }
}
