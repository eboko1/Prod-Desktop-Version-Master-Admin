// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Pie } from 'components/Charts';

// own
import Styles from './styles.m.css';

export default class MiniPie extends Component {
    static defaultProps = {
        height: 90,
        width:  90,
    };

    render() {
        const {
            hasLegend,
            label,
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
                    height={ height }
                    width={ width }
                />
                <div>
                    <span className={ Styles.label }>
                        <FormattedMessage id={ label } />
                    </span>
                    <span className={ Styles.value }>{ percent }</span>
                </div>
            </div>
        );
    }
}
