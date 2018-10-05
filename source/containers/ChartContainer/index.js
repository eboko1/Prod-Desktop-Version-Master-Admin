// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import moment from 'moment';

// proj
import { fetchChart } from 'core/chart/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { UniversalChart } from 'components';
import { UniversalChartModal } from 'modals';

// own
// import Styles from './styles.m.css';

const mapStateToProps = state => ({
    chart:  state.chart,
    filter: state.chart.filter,
    modal:  state.modals.modal,
});

const mapDispatchToProps = {
    fetchChart,
    setModal,
    resetModal,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ChartContainer extends Component {
    _handleChartOption(e, { value, label }) {
        const { period, startDate, endDate, type } = this.state;

        this.setState(
            {
                chartOption: { label, value },
            },
            () =>
                this._fetchChartData({
                    startDate,
                    endDate,
                    period,
                    type,
                }),
        );
    }

    render() {
        const { chartData, filter } = this.props;

        return (
            <Catcher>
                <Button
                    style={ { width: '25%', margin: '12px auto' } }
                    type='primary'
                    onClick={ () => this.props.setModal(MODALS.UNIVERSAL_CHART) }
                >
                    Отображать: { filter.mode }
                    { /* <FormattedMessage id='' /> */ }
                </Button>
                <UniversalChart data={ chartData } mode={ filter.mode } />
                <UniversalChartModal
                    // wrappedComponentRef={ this.saveChartRef }
                    visible={ this.props.modal }
                    resetModal={ this.props.resetModal }
                />
            </Catcher>
        );
    }
}
