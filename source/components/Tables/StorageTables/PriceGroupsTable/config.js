// vendor
import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// own
import { EditableContext } from './context';

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

// export function columnsConfig(formatMessage, deletePriceGroup) {
export function columnsConfig(
    formatMessage,
    editingKey,
    getEditingState,
    startEditing,
    cancelEditing,
    save,
    handleDelete,
) {
    const number = {
        title:     <FormattedMessage id='storage.price_group' />,
        dataIndex: 'number',
        width:     '25%',
    };

    const multiplier = {
        title:     <FormattedMessage id='storage.markup' />,
        dataIndex: 'multiplier',
        width:     '50%',
        editable:  true,
        render:    multiplier => <span>{ multiplier }</span>,
    };

    const operations = {
        title:     '',
        dataIndex: 'operation',
        width:     '25%',
        render:    (text, record) => {
            const editable = getEditingState(record);

            return (
                <ActionsIcons>
                    { editable ? (
                        <span>
                            <EditableContext.Consumer>
                                { form => (
                                    <a
                                        href='javascript:;'
                                        onClick={ () =>
                                            save(form, record.number)
                                        }
                                        style={ { marginRight: 8 } }
                                    >
                                        { formatMessage({ id: 'save' }) }
                                    </a>
                                ) }
                            </EditableContext.Consumer>
                            <Popconfirm
                                title={ `${formatMessage({ id: 'cancel' })} ?` }
                                onConfirm={ () => cancelEditing(record.key) }
                            >
                                <a>{ formatMessage({ id: 'cancel' }) }</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <EditIcon
                            type='edit'
                            disabled={ editingKey !== '' }
                            onClick={ () => startEditing(record.number) }
                        />
                    ) }
                    <Popconfirm
                        title={ `${formatMessage({ id: 'delete' })} ?` }
                        onConfirm={ () => handleDelete(record.number) }
                    >
                        <DeleteIcon type='delete' />
                    </Popconfirm>
                </ActionsIcons>
            );
        },
    };

    return [ number, multiplier, operations ];
}
