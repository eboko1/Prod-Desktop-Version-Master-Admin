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

export default class RepairMapTable extends Component {
    render() {
        const { repairMap } = this.props;
        console.log(repairMap)
        return (
            <div>
                {repairMap.map((elem, key)=>{
                    return (
                        <div
                            key={key}
                            className={Styles.mapBlock}
                        >
                            <div className={Styles[elem.color] + " " + Styles.mapBlockTitle}>{elem.name}</div>
                            <div className={Styles.mapChildsBlock}>
                                {elem.childs.map((child, key)=>{
                                    return (
                                        <div
                                            key={key}
                                            className={Styles[child.color] + " " + Styles.childBlock}
                                        >
                                            {child.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}