// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// own
import { Pie } from 'components/Charts';
import Styles from './styles.m.css';

class MiniPie extends Component {
    render() {
        const {
            hasLegend,
            percent,
            height,
            width,
            color,
            inner,
            tooltip = false,
        } = this.props;

        return (
            <div className={ Styles.miniPie }>
                <Pie
                    // hasLegend={ hasLegend }
                    // total={ total }
                    forceFit={ false }
                    animate={ false }
                    color={ color || 'rgb(81, 205, 102)' }
                    inner={ inner || 0.55 }
                    tooltip={ tooltip }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ percent }
                    height={ height || 90 }
                    width={ width || 90 }
                />
                <div>
                    <span className={ Styles.label }>
                        <FormattedMessage id='add' />
                    </span>
                    <span className={ Styles.value }>{ percent }</span>
                </div>
            </div>
        );
    }
}

export default MiniPie;
