// vendor
import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const DeleteIcon = styled(Icon)`
    color: var(--warning);
    font-size: 24px;
`;

const EditIcon = styled(Icon)`
    color: var(--green);
    font-size: 24px;
    cursor: pointer;
`;

const ActionsIcons = styled.div`
    display: flex;
    align-items: center;
`;

export function columnsConfig(formatMessage, deletePriceGroup) {
    const number = {
        title:     <FormattedMessage id='storage.price_group' />,
        dataIndex: 'number',
        width:     '50%',
    };

    const multiplier = {
        title:     <FormattedMessage id='storage.markup' />,
        dataIndex: 'multiplier',
        width:     '50%',
        editable:  true,
        render:    multiplier => <span>{ multiplier } %</span>,
    };

    const actions = {
        title:     '',
        dataIndex: 'actions',
        width:     'auto',
        render:    (_, data) => (
            <ActionsIcons>
                <EditIcon type='edit' />
                <Popconfirm
                    cancelText={ formatMessage({ id: 'no' }) }
                    okText={ formatMessage({ id: 'yes' }) }
                    title={ `${formatMessage({ id: 'delete' })}?` }
                    onConfirm={() => deletePriceGroup(data.number)} // eslint-disable-line
                >
                    <DeleteIcon type='delete' />
                </Popconfirm>
            </ActionsIcons>
        ),
    };

    return [ number, multiplier, actions ];
}
