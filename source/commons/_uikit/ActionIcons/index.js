import React from 'react';
import { injectIntl } from 'react-intl';
import { Icon, Popconfirm } from 'antd';
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

export default injectIntl(props => {
    return (
        <ActionsIcons>
            { props.edit ? <EditIcon type='edit' onClick={ props.edit } /> : null }
            { props.delete ? (
                <Popconfirm
                    title={ `${props.intl.formatMessage({ id: 'delete' })} ?` }
                    onConfirm={ props.delete }
                >
                    <DeleteIcon type='delete' />
                </Popconfirm>
            ) : null }
        </ActionsIcons>
    );
});
