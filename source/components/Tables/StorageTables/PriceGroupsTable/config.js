// vendor
import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// import { EditableContext } from './editable';
import { EditableContext } from './context';

// const DeleteIcon = styled(Icon)`
//     color: var(--warning);
//     font-size: 24px;
// `;

// const EditIcon = styled(Icon)`
//     color: var(--green);
//     font-size: 24px;
//     cursor: pointer;
// `;

// const ActionsIcons = styled.div`
//     display: flex;
//     align-items: center;
// `;

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
        width:     '50%',
    };

    const multiplier = {
        title:     <FormattedMessage id='storage.markup' />,
        dataIndex: 'multiplier',
        width:     '50%',
        editable:  true,
        render:    multiplier => <span>{ multiplier } %</span>,
    };

    // const actions = {
    //     title:     '',
    //     dataIndex: 'actions',
    //     width:     'auto',
    //     render:    (_, data) => (
    //         <ActionsIcons>
    //             <EditIcon type='edit' />
    //             <Popconfirm
    //                 cancelText={ formatMessage({ id: 'no' }) }
    //                 okText={ formatMessage({ id: 'yes' }) }
    //                 title={ `${formatMessage({ id: 'delete' })}?` }
    //                 onConfirm={() => deletePriceGroup(data.number)} // eslint-disable-line
    //             >
    //                 <DeleteIcon type='delete' />
    //             </Popconfirm>
    //         </ActionsIcons>
    //     ),
    // };

    const operations = {
        title:     '',
        dataIndex: 'operation',
        render:    (text, record) => {
            const editable = getEditingState(record);
            // console.log('→COLUMNS editable', editable);
            // console.log('=== COLUMNS === editingKey', editingKey);
            // console.log('→COLUMNS record.number', record.number);

            return (
                <div>
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
                                        Save
                                    </a>
                                ) }
                            </EditableContext.Consumer>
                            <Popconfirm
                                title='Sure to cancel?'
                                onConfirm={ () => cancelEditing(record.key) }
                            >
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <a
                            disabled={ editingKey !== '' }
                            onClick={ () => startEditing(record.number) }
                            // onClick={ () => startEditing(record.key) }
                        >
                            Edit
                        </a>
                    ) }
                    <Popconfirm
                        title='Sure to delete?'
                        onConfirm={ () => handleDelete(record.number) }
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </div>
            );
        },
    };

    return [
        number, multiplier, operations,
        // actions,
    ];
}
