import React, { Component } from 'react';
import { Chart, Tooltip, Geom, Coord } from 'bizcharts';
import { DataView } from '@antv/data-set';
import { Divider } from 'antd';
import classNames from 'classnames';
import ReactFitText from 'react-fittext';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import _ from 'lodash';

import styles from './styles.m.css';
// import styles from './index.less';

/* eslint react/no-danger:0 */
@autoHeight()
export default class Pie extends Component {
    state = {
        legendData:  [],
        legendBlock: false,
        show:        false,
    };

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();

        setTimeout(() => {
            this.setState({ show: true });
            this.getLegendData();
        }, 800);
    }

    componentDidUpdate(props) {
        const { data } = this.props;
        console.log('→ 11111 prev props', props.data);
        console.log('→ 11111 this.props', data);

        if (data !== props.data) {
            // if (!_.isEqual(data, props.data)) {
            console.log('→ 22222');
            // because of charts data create when rendered
            // so there is a trick for get rendered time
            const { legendData } = this.state;
            this.setState(
                {
                    legendData: [ ...legendData ],
                },
                () => {
                    this.getLegendData();
                },
            );
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
        this.resize.cancel();
    }

    _getG2Instance = chart => {
        this.chart = chart;
    };

    _handleRoot = n => {
        this.root = n;
    };

    // for custom lengend view
    getLegendData = () => {
        // debugger; // eslint-disable-line
        if (!this.chart) {
            return;
        }
        const geom = this.chart.getAllGeoms()[ 0 ]; // Получить всю графику
        const items = geom.get('dataArray') || []; // Получить соответствующую графику

        const legendData = items.map(item => {
            /* eslint no-underscore-dangle:0 */
            const origin = item[ 0 ]._origin;
            origin.color = item[ 0 ].color;
            origin.checked = true;

            return origin;
        });

        this.setState({ legendData });
    };

    handleLegendClick = (item, i) => {
        const newItem = item;
        newItem.checked = !newItem.checked;

        const { legendData } = this.state;
        legendData[ i ] = newItem;

        const filteredLegendData = legendData
            .filter(l => l.checked)
            .map(l => l.x);
        if (this.chart) {
            this.chart.filter('x', val => filteredLegendData.indexOf(val) > -1);
        }

        this.setState({
            legendData,
        });
    };

    // for window resize auto responsive legend
    @Bind()
    @Debounce(300)
    resize() {
        console.log('→ resize');
        // debugger; // eslint-disable-line
        const { hasLegend } = this.props;
        if (!hasLegend || !this.root) {
            window.removeEventListener('resize', this.resize);

            return;
        }
        const { legendBlock } = this.state;
        if (this.root.parentNode.clientWidth <= 380) {
            if (!legendBlock) {
                this.setState({ legendBlock: true });
            }
        } else if (legendBlock) {
            this.setState({ legendBlock: false });
        }
    }
    /* eslint-disable complexity */
    render() {
        const {
            valueFormat,
            subTitle,
            total,
            hasLegend = false,
            className,
            style,
            height,
            width,
            forceFit = true,
            percent = 0,
            color,
            inner = 0.75,
            animate = true,
            colors,
            lineWidth = 1,
        } = this.props;

        // make props transformable
        const {
            data: propsData,
            selected: propsSelected = true,
            tooltip: propsTooltip = true,
        } = this.props;
        let data = propsData || [];
        let selected = propsSelected;
        let tooltip = propsTooltip;
        //

        const { legendData, legendBlock } = this.state;

        const pieClassName = classNames(styles.pie, className, {
            [ styles.hasLegend ]:   !!hasLegend,
            [ styles.legendBlock ]: legendBlock,
        });

        let formatColor; // eslint-disable-line
        if (percent) {
            selected = false;
            tooltip = false;
            formatColor = value => {
                if (value === 'percent') {
                    return color || 'rgba(24, 144, 255, 0.85)';
                }

                return '#F0F2F5';
            };

            data = [
                {
                    x: 'percent',
                    y: parseFloat(percent),
                },
                {
                    x: 'inverse',
                    y: 100 - parseFloat(percent),
                },
            ];
        }

        const scale = {
            x: {
                type:  'cat',
                range: [ 0, 1 ],
            },
            y: {
                min: 0,
            },
        };

        const tooltipFormat = [
            'x*percent',
            (x, p) => ({
                name:  x,
                value: `${(p * 100).toFixed(2)}%`,
            }),
        ];

        const padding = [ 12, 0, 12, 0 ];

        const dv = new DataView();
        dv.source(data).transform({
            type:      'percent',
            field:     'y',
            dimension: 'x',
            as:        'percent',
        });

        return (
            <div ref={ this._handleRoot } className={ pieClassName } style={ style }>
                <ReactFitText maxFontSize={ 25 }>
                    <div className={ styles.chart }>
                        { this.state.show ? (
                            <Chart
                                scale={ scale }
                                height={ height }
                                width={ width }
                                forceFit={ forceFit }
                                data={ dv }
                                padding={ padding }
                                animate={ animate }
                                onGetG2Instance={ this._getG2Instance }
                            >
                                { !!tooltip && <Tooltip showTitle={ false } /> }
                                <Coord type='theta' innerRadius={ inner } />
                                <Geom
                                    style={ { lineWidth, stroke: '#fff' } }
                                    tooltip={ tooltip && tooltipFormat }
                                    type='intervalStack'
                                    position='percent'
                                    color={ [ 'x', percent ? formatColor : colors ] }
                                    selected={ selected }
                                />
                            </Chart>
                        ) : null }

                        { (subTitle || total) && (
                            <div className={ styles.total }>
                                { subTitle && (
                                    <h4 className='pie-sub-title'>
                                        { subTitle }
                                    </h4>
                                ) }
                                { /* eslint-disable-next-line */ }
                                {total && (
                                    <div className='pie-stat'>
                                        { typeof total === 'function'
                                            ? total()
                                            : total }
                                    </div>
                                ) }
                            </div>
                        ) }
                    </div>
                </ReactFitText>

                { hasLegend &&
                    this.state.show && (
                    <ul className={ styles.legend }>
                        { legendData.map((item, i) => (
                            <li
                                key={ item.x }
                                onClick={ () =>
                                    this.handleLegendClick(item, i)
                                }
                            >
                                <span
                                    className={ styles.dot }
                                    style={ {
                                        backgroundColor: !item.checked
                                            ? '#aaa'
                                            : item.color,
                                    } }
                                />
                                <span className={ styles.legendTitle }>
                                    { item.x }
                                </span>
                                <Divider type='vertical' />
                                <span className={ styles.percent }>
                                    { `${(isNaN(item.percent)
                                        ? 0
                                        : item.percent * 100
                                    ).toFixed(2)}%` }
                                </span>
                                <span className={ styles.value }>
                                    { valueFormat
                                        ? valueFormat(item.y)
                                        : item.y }
                                </span>
                            </li>
                        )) }
                    </ul>
                ) }
            </div>
        );
    }
}
