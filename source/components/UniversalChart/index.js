// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import numeral from 'numeral';
import {
    Label,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// own
import { chartMode } from './chartConfig';

@injectIntl
export default class UniversalChart extends Component {
    _tooltip = (value, mode) => {
        const { formatMessage } = this.props.intl;

        return `${numeral(value).format('0,0[]00')}${chartMode[ mode ].type &&
            ` (${formatMessage({ id: chartMode[ mode ].type })})`}`;
    };

    render() {
        const { data, mode, period } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <ResponsiveContainer width='100%' height={ 500 }>
                <AreaChart
                    data={ data }
                    margin={ { top: 20, right: 40, left: 50, bottom: 60 } }
                >
                    <XAxis dataKey='id' tick={ { angle: -35 } } textAnchor='end'>
                        <Label
                            value={ formatMessage({
                                id: period,
                            }) }
                            position='insideBottom'
                            style={ { textAnchor: 'middle' } }
                            offset={ -55 }
                        />
                    </XAxis>
                    <YAxis
                        tickFormatter={ value =>
                            numeral(value).format('0,0[]00')
                        }
                    >
                        <Label
                            angle={ -90 }
                            value={ formatMessage({
                                id: `universal-chart.list.item.${mode}`,
                            }) }
                            position='left'
                            style={ { textAnchor: 'middle' } }
                            offset={ 40 }
                        />
                    </YAxis>
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip formatter={ value => this._tooltip(value, mode) } />
                    <defs>
                        <linearGradient
                            id='colorPv'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                        >
                            <stop
                                offset='5%'
                                stopColor='#82ca9d'
                                stopOpacity={ 0.8 }
                            />
                            <stop
                                offset='95%'
                                stopColor='#82ca9d'
                                stopOpacity={ 0 }
                            />
                        </linearGradient>
                    </defs>
                    <Area
                        type='monotone'
                        name={ formatMessage({
                            id: `universal-chart.list.item.${mode}`,
                        }) }
                        dataKey='score'
                        stroke='#51cd66'
                        fillOpacity={ 1 }
                        fill='url(#colorPv)'
                        strokeWidth={ 4 }
                        activeDot={{ r: 10 }} // eslint-disable-line
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    }
}
