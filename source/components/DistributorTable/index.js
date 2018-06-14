// Vendor
import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import uuid from 'uuid';

// Proj
import { ArrowsNav } from 'components';
// import { Navigation } from 'components';

// Own
import {
    DistributorTableRequest,
    DistributorTableResponse,
    DistributorTableOrder,
    DistributorTableArchive,
} from './Steps';
import Styles from './styles.m.css';
import './DistributorTable.css';

// connect
export default class DistributorTable extends Component {
    static defaultProps = {
        data: [
            {
                key:     '1',
                request: '#RQ-847-101',
                service: 'Зенит',
                auto:    'Toyota Camry, 2007',
                date:    '01.01.2018',
                rqCount: 7,
            },
            {
                key:     '2',
                request: '#RQ-152-214',
                service: 'Техно-Центр',
                auto:    'Audi A6, 2010',
                date:    '01.01.2018',
                rqCount: 4,
            },
            {
                key:     '3',
                request: '#RQ-847-101',
                service: 'Хорс',
                auto:    'Opel Kadett, 1985',
                date:    '01.01.2018',
                rqCount: 6,
            },
            {
                key:     '4',
                request: '#RQ-847-101',
                service: 'Автосоюз',
                auto:    'Dewoo Lanos, 2007',
                date:    '01.01.2018',
                rqCount: 1,
            },
            {
                key:     '5',
                request: '#RQ-847-101',
                service: 'Дельта',
                auto:    'Lexus LX, 2017',
                date:    '01.01.2018',
                rqCount: 2,
            },
            {
                key:     '6',
                request: '#RQ-347-121',
                service: 'Зенит',
                auto:    'Toyota Camry, 2007',
                date:    '01.01.2018',
                rqCount: 7,
            },
            {
                key:     '7',
                request: '#RQ-947-571',
                service: 'Техно-Центр',
                auto:    'Audi A6, 2010',
                date:    '01.01.2018',
                rqCount: 4,
            },
            {
                key:     '8',
                request: '#RQ-107-613',
                service: 'Хорс',
                auto:    'Opel Astra, 1995',
                date:    '01.01.2018',
                rqCount: 6,
            },
            {
                key:     '9',
                request: '#RQ-997-111',
                service: 'Ралли',
                auto:    'Lada, 2007',
                date:    '01.01.2018',
                rqCount: 1,
            },
            {
                key:     '10',
                request: '#RQ-847-101',
                service: 'Дельта',
                auto:    'Lexus LX, 2017',
                date:    '01.01.2018',
                rqCount: 2,
            },
            {
                key:     '11',
                request: '#RQ-246-421',
                service: 'Дельта',
                auto:    'ВАЗ, 2017',
                date:    '01.01.2018',
                rqCount: 2,
            },
        ],
    };

    render() {
        const distributorTableStepper = [
            {
                title:   'Запрос',
                content: <DistributorTableRequest data={ this.props.data } />,
            },
            {
                title:   'Ответ',
                content: <DistributorTableResponse data={ this.props.data } />,
            },
            {
                title:   'Заказ',
                content: <DistributorTableOrder data={ this.props.data } />,
            },
            {
                title:   'Архив заказов',
                content: <DistributorTableArchive data={ this.props.data } />,
            },
            {
                title:   'Отмена',
                content: 'cancel content',
            },
        ];

        return (
            <div className={ Styles.content }>
                <ArrowsNav steps={ distributorTableStepper } />
            </div>
        );
    }
}
