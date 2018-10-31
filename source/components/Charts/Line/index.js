// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import numeral from 'numeral';
import {
    // Label,
    LineChart,
    Line as RechartLine,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import _ from 'lodash';

@injectIntl
export default class Line extends Component {
    static defaultProps = {
        height: 300,
    };

    render() {
        const { data, config, width, height, intlCtx } = this.props;
        const { formatMessage } = this.props.intl;

        return data ? (
            <ResponsiveContainer width={ width } height={ height }>
                <LineChart
                    width={ width }
                    height={ height }
                    data={ data }
                    margin={ { top: 5, right: 30, left: 20, bottom: 5 } }
                >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='id' />
                    <YAxis
                        tickFormatter={ value =>
                            numeral(value).format('0,0[]00')
                        }
                    />
                    <Tooltip
                        formatter={ value => numeral(value).format('0,0[]00') }
                    />
                    <Legend iconType='rect' content={ this._renderLegend } />
                    { _(config.dataKeys)
                        .map(dataKey => (
                            <RechartLine
                                key={ dataKey.name }
                                dataKey={ dataKey.name }
                                fill={ dataKey.color }
                                type='monotone'
                                name={ formatMessage({
                                    id: `${intlCtx}.${_.snakeCase(
                                        dataKey.name,
                                    )}`,
                                }) }
                                stroke={ dataKey.color }
                                strokeWidth={ 4 }
                                activeDot={{ r: 10 }} // eslint-disable-line
                            />
                        ))
                        .value() }
                </LineChart>
            </ResponsiveContainer>
        ) : null;
    }
}
