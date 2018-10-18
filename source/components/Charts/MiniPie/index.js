// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Pie } from 'components/Charts';

// own
import Styles from './styles.m.css';

export default class MiniPie extends Component {
    static defaultProps = {
        height:  90,
        width:   90,
        margin:  [ 0, 0, 0, 0 ],
        inner:   0.5,
        tooltip: false,
        color:   'rgb(81, 205, 102)',
    };

    render() {
        const {
            hasLegend,
            label,
            percent,
            height,
            width,
            margin,
            color,
            inner,
            tooltip,
        } = this.props;

        return (
            <div className={ Styles.miniPie }>
                <Pie
                    // hasLegend={ hasLegend }
                    // total={ total }
                    forceFit={ false }
                    animate={ false }
                    color={ color }
                    inner={ inner }
                    tooltip={ tooltip }
                    margin={ margin }
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
