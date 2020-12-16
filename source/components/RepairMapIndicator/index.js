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
        const { data, style, scrollToId } = this.props;
        return (
            <div className={Styles.repairMapIndicator} style={style}>
                {data && data.map((elem, key)=>{
                    if(elem.abbreviature && elem.show) {
                        return (
                            <div
                                key={key}
                                title={elem.name}
                                className={Styles[elem.color] + " " + Styles.indicatorElement}
                                onClick={()=>{
                                    if(scrollToId) scrollToId(elem.abbreviature);
                                }}
                            >
                                {elem.abbreviature}
                            </div>
                        )
                    }
                })}
            </div>
        )
    }
}