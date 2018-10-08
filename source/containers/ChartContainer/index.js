// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { fetchChart, setChartMode } from 'core/chart/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { UniversalChart } from 'components';
import { UniversalChartModal } from 'modals';

// own
// import Styles from './styles.m.css';

const mapStateToProps = state => ({
    chart: state.chart,
    // filter: state.chart.filter,
    modal: state.modals.modal,
});

const mapDispatchToProps = {
    fetchChart,
    setChartMode,
    setModal,
    resetModal,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ChartContainer extends Component {
    render() {
        const {
            chartData,
            filter,
            modal,
            setModal,
            resetModal,
            fetchChart,
            setChartMode,
            startDate,
            endDate,
        } = this.props;

        return (
            <Catcher>
                <Button
                    style={ { margin: '12px auto' } }
                    type='primary'
                    onClick={ () => setModal(MODALS.UNIVERSAL_CHART) }
                >
                    <FormattedMessage id='universal_chart.show' />:{ ' ' }
                    <span style={ { fontWeight: 'bold' } }>
                        <FormattedMessage
                            id={ `universal-chart.list.item.${filter.mode}` }
                        />
                    </span>
                </Button>
                <UniversalChart
                    data={ chartData }
                    mode={ filter.mode }
                    period={ filter.period }
                />
                <UniversalChartModal
                    // wrappedComponentRef={ this.saveChartRef }
                    mode={ filter.mode }
                    period={ filter.period }
                    visible={ modal }
                    resetModal={ resetModal }
                    setChartMode={ setChartMode }
                    fetchChart={ fetchChart }
                    startDate={ startDate }
                    endDate={ endDate }
                />
            </Catcher>
        );
    }
}
