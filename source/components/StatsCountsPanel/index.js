// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher, Numeral } from 'commons';

// own
import Styles from './styles.m.css';

export default class StatsCountsPanel extends Component {
    render() {
        const { stats } = this.props;

        return stats ? (
            <Catcher>
                <div className={ Styles.stats }>
                    { Object.keys(stats).map(key => (
                        <div className={ Styles.count } key={ v4() }>
                            <FormattedMessage
                                id={ `stats_counts_panel.${key}` }
                            />
                            <Numeral>{ stats[ key ] }</Numeral>
                        </div>
                    )) }
                </div>
            </Catcher>
        ) : null;
    }
}
