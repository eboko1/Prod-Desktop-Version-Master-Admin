// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

class StatsCountsPanel extends Component {
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
                            <div>{ stats[ key ] }</div>
                        </div>
                    )) }
                </div>
            </Catcher>
        ) : null;
    }
}

export default StatsCountsPanel;
