import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';
import { isAdmin } from 'utils';

const mapStateToProps = state => ({
    user: state.auth,
});

export const StoreProductsSetting = connect(mapStateToProps)(
    ({ setModal, storeGroup, user }) => {
        return (
            <>
                <Icon
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
                />
                { isAdmin(user) ? (
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
                ) : null }
            </>
        );
    },
);
