// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Chart, Tooltip, Geom, Coord } from "bizcharts";
import { DataView } from "@antv/data-set";
import { Divider } from "antd";
import classNames from "classnames";
import ReactFitText from "react-fittext";
import Debounce from "lodash-decorators/debounce";
import Bind from "lodash-decorators/bind";
import _ from "lodash";

// proj
import { Numeral } from "commons";

// own
import autoHeight from "components/Charts/autoheight.js";
import Styles from "./styles.m.css";

/* eslint react/no-danger:0 */
@injectIntl
@autoHeight()
export default class Pie extends Component {
    static defaultProps = {
        hasLegend: false,
        forceFit: true,
        percent: 0,
        inner: 0.75,
        animate: true,
        lineWidth: 1,
        padding: [12, 0, 12, 0],
    };

    state = {
        legendData: [],
        legendBlock: false,
        show: false,
    };

    componentDidMount() {
        window.addEventListener("resize", this.resize);
        this.resize();
        // HACK: for initialization pie chart refs for forceFit
        // setImmediate doesn't provide same result
        setTimeout(() => {
            this.setState({ show: true });
            this.getLegendData();
        }, 1000);
    }

    componentDidUpdate(props) {
        const { data } = this.props;

        if (data !== props.data) {
            // because of charts data create when rendered
            // so there is a trick for get rendered time
            const { legendData } = this.state;
            this.setState(
                {
                    legendData: [...legendData],
                },
                () => {
                    this.getLegendData();
                },
            );
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
        this.resize.cancel();
    }

    _getG2Instance = chart => {
        this.chart = chart;
    };

    _handleRoot = node => {
        this.root = node;
    };

    // for custom lengend view
    getLegendData = () => {
        if (!this.chart) {
            return;
        }
        const geom = this.chart.getAllGeoms()[0]; // Получить всю графику
        const items = geom.get("dataArray") || []; // Получить соответствующую графику

        const legendData = items.map(item => {
            /* eslint no-underscore-dangle:0 */
            const origin = item[0]._origin;
            origin.color = item[0].color;
            origin.checked = true;

            return origin;
        });

        this.setState({ legendData });
    };

    handleLegendClick = (item, index) => {
        const newItem = item;
        newItem.checked = !newItem.checked;

        const { legendData } = this.state;
        legendData[index] = newItem;

        const filteredLegendData = legendData
            .filter(legend => legend.checked)
            .map(legend => legend.x);

        if (this.chart) {
            this.chart.filter("x", val => filteredLegendData.indexOf(val) > -1);
        }

        this.setState({ legendData });
    };

    // for window resize auto responsive legend
    @Bind()
    @Debounce(300)
    resize() {
        const { hasLegend } = this.props;
        if (!hasLegend || !this.root) {
            window.removeEventListener("resize", this.resize);

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
            hasLegend,
            className,
            style,
            height,
            width,
            forceFit,
            percent,
            color,
            inner,
            animate,
            colors,
            lineWidth,
            padding,
            intlCtx,
            intl: { formatMessage },
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

        const { legendData, legendBlock } = this.state;

        const pieClassName = classNames(Styles.pie, className, {
            [Styles.hasLegend]: !!hasLegend,
            [Styles.legendBlock]: legendBlock,
        });

        let formatColor; // eslint-disable-line
        if (percent) {
            selected = false;
            tooltip = false;
            formatColor = value => {
                if (value === "percent") {
                    return color || "rgba(24, 144, 255, 0.85)";
                }

                return "#F0F2F5";
            };

            data = [
                {
                    x: "percent",
                    y: parseFloat(percent),
                },
                {
                    x: "inverse",
                    y: 100 - parseFloat(percent),
                },
            ];
        }

        const scale = {
            x: {
                type: "cat",
                range: [0, 1],
            },
            y: {
                min: 0,
            },
        };

        const tooltipFormat = [
            "x*percent",
            (x, percent) => ({
                name: formatMessage({ id: `${intlCtx}.${_.snakeCase(x)}` }),
                value: `${(percent * 100).toFixed(2)}%`,
            }),
        ];

        const dv = new DataView();
        dv.source(data).transform({
            type: "percent",
            field: "y",
            dimension: "x",
            as: "percent",
        });

        return (
            <div ref={this._handleRoot} className={pieClassName} style={style}>
                <ReactFitText maxFontSize={25}>
                    <div className={Styles.chart}>
                        {this.state.show ? (
                            <Chart
                                scale={scale}
                                height={height}
                                width={width}
                                forceFit={forceFit}
                                data={dv}
                                padding={padding}
                                animate={animate}
                                onGetG2Instance={this._getG2Instance}
                            >
                                {!!tooltip && <Tooltip showTitle={false} />}
                                <Coord type="theta" innerRadius={inner} />
                                <Geom
                                    style={{ lineWidth, stroke: "#fff" }}
                                    tooltip={tooltip && tooltipFormat}
                                    type="intervalStack"
                                    position="percent"
                                    color={[
                                        "x",
                                        percent ? formatColor : colors,
                                    ]}
                                    selected={selected}
                                />
                            </Chart>
                        ) : null}

                        {(subTitle || total) && (
                            <div className={Styles.total}>
                                {subTitle && (
                                    <h4 className={Styles.pieSubTitle}>
                                        {subTitle}
                                    </h4>
                                )}
                                {/* eslint-disable-next-line */}
                                {total && (
                                    <div className="pie-stat">
                                        {typeof total === "function" ? (
                                            <Numeral>{total()}</Numeral>
                                        ) : (
                                            <Numeral>{total}</Numeral>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ReactFitText>

                {hasLegend && this.state.show && (
                    <ul className={Styles.legend}>
                        {legendData.map((item, index) => (
                            <li
                                key={item.x}
                                onClick={() =>
                                    this.handleLegendClick(item, index)
                                }
                            >
                                <span
                                    className={Styles.dot}
                                    style={{
                                        backgroundColor: !item.checked
                                            ? "#aaa"
                                            : item.color,
                                    }}
                                />
                                <span className={Styles.legendTitle}>
                                    <FormattedMessage
                                        id={`${intlCtx}.${_.snakeCase(item.x)}`}
                                    />
                                </span>
                                <Divider type="vertical" />
                                <span className={Styles.percent}>
                                    {`${(isNaN(item.percent)
                                        ? 0
                                        : item.percent * 100
                                    ).toFixed(0)}%`}
                                </span>
                                <Divider type="vertical" />
                                <Numeral className={Styles.value}>
                                    {valueFormat ? valueFormat(item.y) : item.y}
                                </Numeral>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}
