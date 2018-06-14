// Vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Card } from 'antd';
const TabPane = Tabs.TabPane;
// import { Map, fromJS } from 'immutable';

// Project
import { authActions } from 'core/auth/actions';
import { Spinner } from 'commons';
import { LoginForm } from 'forms';

// Own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        authFetching: state.ui.get('authFetching'),
    };
};

//bindActionCreators позволяет привезять вложеные обхекты
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ login: authActions.login }, dispatch),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Login extends Component {
    state = {
        fields: {
            login: {
                value: null,
            },
            password: {
                value: null,
            },
            type: {
                value: 'manager',
            },
        },
    };

    _handleFormChange = changedFields => {
        // const fields = this.state.fields;
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    _handleRoleTab = type => {
        console.log('type', this.state.fields.type);
        const role = this.state.fields.type.value;
        console.log('role', role);
        this.setState(prevState => {
            console.log('prevState', prevState.fields);

            return {
                fields: {
                    ...prevState.fields,
                    type: { value: type },
                },
            };
        });
    };

    render() {
        const { authFetching } = this.props;
        const fields = this.state.fields;

        const loginForm = (
            <LoginForm
                { ...this.props }
                fields={ fields }
                onChange={ this._handleFormChange }
            />
        );

        return (
            <Card title='Зайти как:' className={ Styles.card }>
                <Spinner spin={ authFetching } />
                <Tabs
                    defaultActiveKey='1'
                    tabPosition='left'
                    className={ Styles.tabs }
                    onTabClick={ () => this._handleRoleTab('distributor') }
                >
                    <TabPane tab='Менеджер' key='1' className={ Styles.tab }>
                        { loginForm }
                    </TabPane>
                    <TabPane tab='Дистрибьютор' key='2'>
                        { loginForm }
                    </TabPane>
                    <TabPane tab='Запчастист' key='3'>
                        { loginForm }
                    </TabPane>
                    <TabPane tab='Администратор' key='4'>
                        { loginForm }
                    </TabPane>
                </Tabs>
            </Card>
        );
    }
}
