import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';
import { permissions, isForbidden, isAdmin } from 'utils';

const mapStateToProps = state => ({
    user: state.auth,
});

export const StoreProductsSetting = connect(mapStateToProps)(
    ({ setModal, storeGroup, user }) => {
        const renderEditing = () => {
            return (
                <>
                    <Icon
                        type={ 'edit' }
                        onClick={ () =>
                            setModal(MODALS.STORE_GROUP, {
                                edit: true,
                                storeGroup,
                            })
                        }
                        style={ {
                            fontSize: '16px',
                            color:    'var(--secondary)',
                        } }
                    />
                    <Icon
                        type={ 'delete' }
                        onClick={ () =>
                            setModal(MODALS.STORE_GROUP, {
                                delete: true,
                                storeGroup,
                            })
                        }
                        style={ {
                            fontSize: '16px',
                            color:    'var(--warning)',
                        } }
                    />
                </>
            );
        };

        return (
            <>
                { /*<Icon
                    type={ 'plus' }
                    onClick={ () =>
                        setModal(MODALS.STORE_GROUP, {
                            create: true,
                            storeGroup,
                        })
                    }
                    style={ {
                        fontSize: '16px',
                        color:    'var(--primary)',
                    } }
                />*/ }
                { !isForbidden(user, permissions.ACCESS_STORE_GROUPS)
                    ? renderEditing()
                    : !storeGroup.systemWide
                        ? renderEditing()
                        : null }
            </>
        );
    },
);
