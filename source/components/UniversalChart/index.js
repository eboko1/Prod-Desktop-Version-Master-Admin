// vendor
import React, { Component } from 'react';
import numeral from 'numeral';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default class UniversalChart extends Component {
    render() {
        const { data, label } = this.props;

        const lineLabel = label => label.substring(0, label.indexOf('('));

        return (
            <ResponsiveContainer width='100%' height={ 500 }>
                <LineChart data={ data }>
                    <XAxis dataKey='begin_date' />
                    <YAxis
                        tickFormatter={ value =>
                            numeral(value).format('0,0[.]00')
                        }
                    />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip
                        formatter={ (value, name) => {
                            const index = name.substring(
                                name.indexOf('('),
                                name.length,
                            );
                            if (label.includes('грн')) {
                                return (
                                    numeral(value).format('0,0[.]00') + ' (грн)'
                                );
                            } else if (label.includes('%')) {
                                return (
                                    numeral(value).format('0,0[.]00') + ' (%)'
                                );
                            } else if (label.includes('шт')) {
                                return (
                                    numeral(value).format('0,0[.]00') + ' (шт)'
                                );
                            } else if (label.includes('мин')) {
                                return (
                                    numeral(value).format('0,0[.]00') + ' (мин)'
                                );
                            } else if (label.includes('хв')) {
                                return (
                                    numeral(value).format('0,0[.]00') + ' (хв)'
                                );
                            } else if (label.includes('авто')) {
                                return (
                                    numeral(value).format('0,0[.]00') +
                                    ' (авто)'
                                );
                            }

                            return numeral(value).format('0,0[.]00');
                        } }
                    />
                    <Legend
                        iconType='line'
                        iconSize={ 14 }
                        payload={ [
                            {
                                value: `${label}`,
                                type:  'line',
                                id:    'ID01',
                            },
                        ] }
                    />
                    <Line
                        type='monotone'
                        name={ lineLabel(label) }
                        dataKey='score'
                        stroke='#39B89F'
                        strokeWidth={ 4 }
                        activeDot={ { r: 10 } }
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
