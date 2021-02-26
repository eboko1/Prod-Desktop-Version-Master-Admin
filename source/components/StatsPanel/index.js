// vendor
import React, { Component } from 'react';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { Catcher, Numeral } from 'commons';

// own
import Styles from './styles.m.css';

export default class StatsCountsPanel extends Component {
    render() {
        const {
            stats = [], //Array of objects composed of { key, value, label } properties
            extended
        } = this.props;

        return stats ? (
            <Catcher>
                <div
                    className={
                        extended ? Styles.extendedStats : Styles.stats
                    }
                >
                    { _.map(stats, obj => (
                        <div
                            className={
                                extended
                                    ? Styles.extendedCounts
                                    : Styles.count
                            }
                            key={ obj.key || v4() }
                        >
                            <div className={Styles.statsHeader}>{obj.label}</div>
                            <Numeral>{ obj.value }</Numeral>
                        </div>
                    )) }
                </div>
            </Catcher>
        ) : null;
    }
}
