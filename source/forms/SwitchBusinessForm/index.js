//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, List } from 'antd';

// proj
import {
    setSearchQuery,
    setBusiness,
    onChangeSwitchBusinessForm,
} from 'core/forms/switchBusinessForm/duck';

import { Loader } from 'components';
import { DecoratedInput } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm({
    name:    'switchBusinessForm',
    actions: {
        change: onChangeSwitchBusinessForm,
        setSearchQuery,
        setBusiness,
    },
})
export class SwitchBusinessForm extends Component {
    render() {
        const {
            setBusiness,
            setSearchQuery,
            businesses,
            form: { getFieldDecorator },
            loading,
        } = this.props;

        return (
            <Form layout='vertical'>
                <DecoratedInput
                    formItem
                    field={ 'searchQuery' }
                    onChange={ event => setSearchQuery(event.target.value) }
                    getFieldDecorator={ getFieldDecorator }
                />
                { !loading ? (
                    <List
                        bordered
                        className={ Styles.switchBusinessList }
                        dataSource={ businesses }
                        renderItem={ item => (
                            <List.Item
                                onClick={ () => setBusiness(item.businessId) }
                            >
                                <List.Item.Meta
                                    className={ Styles.switchBusinessListItem }
                                    title={ item.name }
                                    description={ item.address }
                                />
                            </List.Item>
                        ) }
                    />
                ) : (
                    <Loader loading={ loading } />
                ) }
            </Form>
        );
    }
}
