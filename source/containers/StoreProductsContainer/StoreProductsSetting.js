import React from 'react';
import { Icon } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';

export const StoreProductsSetting = props => {
    const { setModal } = props;

    return (
        <>
            <Icon
                type={ 'plus' }
                onClick={ () => setModal(MODALS.STORE_GROUP, { create: true }) }
                style={ {
                    fontSize: '16px',
                    color:    'var(--primary)',
                } }
            />
            <Icon
                type={ 'edit' }
                onClick={ () => setModal(MODALS.STORE_GROUP, { edit: true }) }
                style={ {
                    fontSize: '16px',
                    color:    'var(--secondary)',
                } }
            />
            <Icon
                type={ 'delete' }
                onClick={ () => setModal(MODALS.STORE_GROUP, { delete: true }) }
                style={ {
                    fontSize: '16px',
                    color:    'var(--warning)',
                } }
            />
        </>
    );
};
