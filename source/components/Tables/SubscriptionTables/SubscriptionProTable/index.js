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
    fetchSubscriptionPackages,
    setSubscriptionPackagesFilters,
    selectSubscriptionPackages,
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
    packages: selectSubscriptionPackages(state),
});

const mapDispatchToProps = {
    fetchSubscriptionPackages,
    setSubscriptionPackagesFilters,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class SubscriptionProTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    componentDidMount() {
        this.props.fetchSubscriptionPackages(SUBSCRIPTION_TYPES.ROLES_PACKAGE);
    }

    // _onDateRangeChange = value => {
    //     const normalizedValue = value.map(date => date.format("YYYY-MM-DD"));
    //     const daterange = {
    //         startDatetime: normalizedValue[0],
    //         endDatetime: normalizedValue[1],
    //     };
    //     this.props.setSubscriptionPackagesFilters(daterange);
    //     this.props.fetchSubscriptionPackages(SUBSCRIPTION_TYPES.ROLES_PACKAGES);
    // };
    _handleDatePicker = date => {
        this.props.setSubscriptionPackagesFilters({
            startDatetime: moment(date).format("YYYY-MM-DD"),
        });
        this.props.fetchSubscriptionPackages(SUBSCRIPTION_TYPES.ROLES_PACKAGES);
    };

    render() {
        const { packages } = this.props;

        const pagination = {
            pageSize: 10,
            size: "large",
            total: Math.ceil(packages.stats.count / 10) * 10,
            hideOnSinglePage: true,
            current: packages.filters.page,
            onChange: page => {
                this.props.setSubscriptionPackagesFilters({ page });
                this.props.fetchSubscriptionPackages(
                    SUBSCRIPTION_TYPES.ROLES_PACKAGES,
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
                            <FormattedMessage id="subscription-table.pro" />
                        </h3>
                    </ResponsiveView>
                    <DatePickerField
                        date={moment(_.get(packages, "filters.startDatetime"))}
                        onChange={this._handleDatePicker}
                        className={Styles.datePickerField}
                    />
                    {/* <RangePickerField
                        onChange={this._onDateRangeChange}
                        // loading={ loading }
                        startDate={_.get(packages, "filters.startDatetime")}
                        endDate={_.get(packages, "filters.endDatetime")}
                    /> */}
                </div>
                <Table
                    className={Styles.table}
                    size="small"
                    columns={this.columns}
                    dataSource={_.get(packages, "list", [])}
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
