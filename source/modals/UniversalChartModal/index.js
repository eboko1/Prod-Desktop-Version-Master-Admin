// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { List, Modal, Icon } from 'antd';
import classNames from 'classnames/bind';

// proj
import { MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';

// own
import { chartList } from 'components/UniversalChart/chartConfig.js';
import Styles from './styles.m.css';

let cx = classNames.bind(Styles);

@injectIntl
export default class UniversalChartModal extends Component {
    _setUniversalChartMode = mode => {
        const { setChartMode, fetchChart, resetModal } = this.props;

        setChartMode(mode);
        fetchChart();
        resetModal();
    };

    render() {
        const {
            visible,
            resetModal,
            mode,
            intl: { formatMessage },
        } = this.props;

        const _listItemStyles = activeMode => {
            return cx({
                listItem:       true,
                listItemActive: mode === activeMode,
            });
        };

        return (
            <Modal
                title={ <FormattedMessage id='universal_chart.modal.header' /> }
                visible={ visible === MODALS.UNIVERSAL_CHART }
                onCancel={ () => resetModal() }
                footer={ null }
                className={ Styles.modal }
            >
                <Catcher>
                    { Object.keys(chartList).map((key, index) => (
                        <div key={ `${index}-list` }>
                            <div className={ Styles.listTitle }>
                                <FormattedMessage
                                    id={ `universal_chart.list.title.${key}` }
                                />
                            </div>
                            <List
                                size='small'
                                bordered
                                locale={ {
                                    emptyText: formatMessage({ id: 'no_data' }),
                                } }
                                dataSource={ chartList[ key ] }
                                renderItem={ item => (
                                    <List.Item
                                        className={ _listItemStyles(item.mode) }
                                        onClick={ () =>
                                            this._setUniversalChartMode(
                                                item.mode,
                                            )
                                        }
                                    >
                                        <List.Item.Meta
                                            className={ Styles.chartListItem }
                                            title={
                                                <>
                                                    <FormattedMessage
                                                        id={ `universal-chart.list.item.${
                                                            item.mode
                                                        }` }
                                                    />
                                                    {item.type &&
                                                        ` (${formatMessage({
                                                            id: item.type,
                                                        })})`}
                                                </>
                                            }
                                            // description={  }
                                        />
                                    </List.Item>
                                ) }
                            />
                        </div>
                    )) }
                </Catcher>
            </Modal>
        );
    }
}
