// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
// own
import Styles from './styles.m.css';

export default class RepairMapIndicator extends Component {
    render() {
        const { data, style } = this.props;
        return (
            <div className={Styles.repairMapIndicator} style={style}>
                {data.map((elem, key)=>{
                    return (
                        <div
                            key={key}
                            title={elem.name}
                            className={Styles[elem.color] + " " + Styles.indicatorElement}
                        >
                            {elem.abbreviature}
                        </div>
                    )
                })}
            </div>
        )
    }
}