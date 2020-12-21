'use strict'

//vendor
import React, {Component} from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Row, Col, Menu, Checkbox, DatePicker, Input, Dropdown, Button, Icon } from 'antd';

//proj
import { DateRangePicker } from 'components';

//own
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'YYYY/MM/DD';
const DEF_UI_DATE_FORMAT = 'DD/MM/YYYY';

export default class ReportLoadKPIFilter extends Component {

    constructor(props) {
        super(props);
       
    }

    render() {

        return (
            <div className={Styles.mainCont}>
                <DateRangePicker styles={{margin: 0}}/>
            </div>
        )
    }
}