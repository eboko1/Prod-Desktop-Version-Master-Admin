// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import numeral from 'numeral';
import {
    Text,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import _ from 'lodash';

// own
import { chartMode } from './chartConfig';

@injectIntl
export default class UniversalChart extends Component {
    _tooltip = (value, mode) => {
        const { formatMessage } = this.props.intl;

        return `${numeral(value).format('0,0[]00')} (${formatMessage({
            id: chartMode[ mode ].type,
        })})`;
    };

    // ctx: CanvasRenderingContext2D;

    _measureText = text => {
        console.log('→ text', text);
        console.log('→ this.ctx', this.ctx);
        if (!this.ctx) {
            this.ctx = document.createElement('canvas').getContext('2d');
            this.ctx.font = '12px "Helvetica Neue"';
        }
        console.log(
            '→ this.ctx.measureText(text).width',
            this.ctx.measureText(text).width,
        );

        return this.ctx.measureText(text).width;
    };

    render() {
        const { data, mode } = this.props;
        const { formatMessage } = this.props.intl;
        // const layout = 'vertical';
        // const { x, y, stroke, payload } = this.props;
        let leftMargin = 0;
        // if (layout === 'vertical') {
        for (const value of data) {
            const textWidth = this._measureText(value.name);
            console.log('→ textWidth', textWidth);
            if (textWidth > leftMargin) {
                leftMargin = textWidth;
            }
        }

        // We have pixel-perfect measurements for the width of our labels, but we also need to account for the default spacing.
        leftMargin = Math.max(0, leftMargin - 50);
        // }

        return (
            <ResponsiveContainer width='100%' height={ 500 }>
                <LineChart
                    data={ data }
                    // margin={ { left: leftMargin } }
                    margin={ { top: 10, right: 40, left: 50, bottom: 5 } }
                >
                    <XAxis dataKey='startDate' />
                    <YAxis
                        // width={ 100 }
                        // tick={
                        //     <Text
                        //         style={ { fontSize: 12 } }
                        //         width={ 80 }
                        //         textAnchor='middle'
                        //         scaleToFit
                        //     >
                        //         { numeral(data.startDate).format('0,0[.]00') }
                        //     </Text>
                        // }
                        tickFormatter={
                            value => numeral(value).format('0,0[.]00')
                            // value => (
                            //     <Text
                            //         style={ { fontSize: 12 } }
                            //         width={ 80 }
                            //         textAnchor='middle'
                            //         scaleToFit
                            //     >
                            //         { numeral(value).format('0,0[.]00') }
                            //     </Text>
                            // )
                        }
                    />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip formatter={ value => this._tooltip(value, mode) } />
                    <Legend
                        iconType='line'
                        // iconSize={ 14 }
                        verticalAlign='bottom'
                        payload={ [
                            {
                                value: formatMessage({ id: mode }),
                                type:  'line',
                                id:    'ID01',
                            },
                        ] }
                    />
                    <Line
                        type='monotone'
                        name={ formatMessage({ id: mode }) }
                        dataKey='score'
                        stroke='#51cd66'
                        strokeWidth={ 4 }
                        activeDot={ { r: 10 } }
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
