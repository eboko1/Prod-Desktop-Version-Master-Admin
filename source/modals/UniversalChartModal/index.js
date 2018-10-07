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
    render() {
        const {
            visible,
            resetModal,
            intl: { formatMessage },
            setChartMode,
            mode,
        } = this.props;

        const _listItemStyles = activeMode => {
            console.log('→ mode', mode);
            console.log('→ activemode', activeMode);

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
                                // className={ Styles.switchBusinessList }
                                locale={ {
                                    emptyText: formatMessage({ id: 'no_data' }),
                                } }
                                dataSource={ chartList[ key ] }
                                renderItem={ item => (
                                    <List.Item
                                        className={ _listItemStyles(item.mode) }
                                        onClick={ () =>
                                            setChartMode({
                                                mode: item.mode,
                                            })
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
                                            // description={ item.address }
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
