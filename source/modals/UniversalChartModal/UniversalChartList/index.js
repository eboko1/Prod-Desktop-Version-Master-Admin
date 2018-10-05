//vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { List } from 'antd';

// proj

// own
// import Styles from './styles.m.css';

@injectIntl
export class UniversalChartList extends Component {
    render() {
        const {
            chartModes,
            intl: { formatMessage },
            setChartMode,
        } = this.props;

        const subList = this._renderSubList();

        return (
            <List
                bordered
                // className={ Styles.switchBusinessList }
                locale={ { emptyText: formatMessage({ id: 'no_data' }) } }
                // dataSource={ chartModes }
                // loading={ loading }
                renderItem={ item => (
                    <List.Item
                        onClick={ () =>
                            setChartMode({
                                mode: item.mode,
                            })
                        }
                    >
                        <List.Item.Meta
                            // className={ Styles.switchBusinessListItem }
                            title={ item.name }
                            // description={ item.address }
                        />
                        { subList }
                    </List.Item>
                ) }
            />
        );
    }

    _renderSubList = () => {
        const {
            intl: { formatMessage },
        } = this.props;

        return (
            <List
                // bordered
                // className={ Styles.switchBusinessList }
                locale={ { emptyText: formatMessage({ id: 'no_data' }) } }
                // dataSource={ chartModes }
                // loading={ loading }
                renderItem={ item => (
                    <List.Item
                        onClick={ () =>
                            setBusiness({
                                businessId:   item.businessId,
                                businessName: item.name,
                            })
                        }
                    >
                        <List.Item.Meta
                            // className={ Styles.switchBusinessListItem }
                            title={ item.name }
                            description={ item.address }
                        />
                    </List.Item>
                ) }
            />
        );
    };
}
