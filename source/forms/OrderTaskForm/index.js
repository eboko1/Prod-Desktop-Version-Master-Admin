// vendor
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Select, Radio, Tabs, Input, Icon, Button } from "antd";
import { injectIntl, FormattedMessage } from "react-intl";
import { v4 } from "uuid";
import _ from "lodash";

//proj
import {
  onChangeOrderForm,
  setClientSelection,
  onChangeOrderServices,
  onChangeOrderDetails,
  onServiceSearch,
  onDetailSearch,
  onBrandSearch
} from "core/forms/orderForm/duck";

import { defaultDetails } from "./../../core/forms/orderForm/helpers/details";

import {
  DecoratedTextArea,
  DecoratedSelect,
  DecoratedInputNumber,
  DecoratedDatePicker
} from "forms/DecoratedFields";
import {
  DetailsTable,
  ServicesTable,
  DiscountPanel,
  ClientsSearchTable,
  TasksTable,
  HistoryTable,
  CallsTable
} from "components/OrderFormTables";

import { withReduxForm, hasErrors, getDateTimeConfig, images } from "utils";
import {
  formItemAutoColLayout,
  formItemLayout,
  formItemTotalLayout
} from "./layouts";
import { servicesStats, detailsStats } from "./stats";

// own
// import { DecoratedInput } from './DecoratedInput';
import Styles from "./styles.m.css";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

@injectIntl
@withReduxForm({
  name: "orderForm",
  debouncedFields: [
    "comment",
    "recommendation",
    "vehicleCondition",
    "businessComment"
  ],
  actions: {
    change: onChangeOrderForm,
    setClientSelection,
    onChangeOrderServices,
    onChangeOrderDetails,
    onServiceSearch,
    onDetailSearch,
    onBrandSearch
  }
})
export class OrderForm extends Component {
  render() {
    return (
      <Form
        className={Styles.form}
        // onSubmit={ this.handleSubmit }
        layout="horizontal"
      >
        HEllo
      </Form>
    );
  }
}
