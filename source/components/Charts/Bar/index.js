// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
    BarChart,
    Bar as BarColumn,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Surface,
    Symbols,
} from 'recharts';
import numeral from 'numeral';
import _ from 'lodash';

// own
import Styles from './styles.m.css';

@injectIntl
export default class Bar extends Component {
    static defaultProps = {
        width:  '100%',
        height: 300,
    };

    state = {
        active: '',
    };

    handleClick = e => {
        const dataKey = e.target.innerText;
        this.setState({ active: dataKey });
    };

    render() {
        const { width, height, data, config } = this.props;

        return data ? (
            <ResponsiveContainer width={ width } height={ height }>
                <BarChart
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
                    <Tooltip />
                    <Legend
                        iconType='rect'
                        content={ this._renderLegend }
                        onClick={ this.handleClick }
                        // payload={ [{ value: 'item id', type: 'line', id: 'ID01' }] }
                    />
                    { _(config.dataKeys)
                        .map(dataKey => (
                            <BarColumn
                                key={ dataKey.name }
                                dataKey={ dataKey.name }
                                fill={ dataKey.color }
                            />
                        ))
                        .value() }
                </BarChart>
            </ResponsiveContainer>
        ) : null;
    }

    _renderLegend = props => {
        const { payload } = props;
        const { intlCtx } = this.props;
        const { active } = this.state;

        return (
            <ul className={ Styles.legend }>
                { payload.map(({ dataKey, value, color }, index) => {
                    return (
                        <li
                            key={ `bar-${index}` }
                            style={
                                dataKey === active
                                    ? { color: 'black' }
                                    : { color: color }
                                // ? { color: fill }
                                // : { color: 'black' }
                            }
                        >
                            <Surface
                                width={ 10 }
                                height={ 10 }
                                // viewBox='0 0 10 10'
                                viewBox={ { x: 0, y: 0, width: 10, height: 10 } }
                                onClick={ this.handleClick }
                            >
                                <Symbols
                                    cx={ 5 }
                                    cy={ 5 }
                                    type='square'
                                    size={ 50 }
                                    fill={ color }
                                    onClick={ this.handleClick }
                                />
                            </Surface>
                            <FormattedMessage
                                id={ `${intlCtx}.${_.snakeCase(value)}` }
                            />
                        </li>
                    );
                }) }
            </ul>
        );
    };
}
