// Core
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'antd';

import { swapiActions } from 'core/swapi/actions';
// import { uiActions } from 'core/ui/actions';

// Components
import { Layout, Spinner, Catcher } from 'commons';
import { LanguagePad } from 'components';
import { AntReduxForm } from 'forms';

const mapStateToProps = state => {
    return {
        swapi:         state.swapi,
        swapiFetching: state.ui.get('swapiFetching'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                ...swapiActions,
            },
            dispatch,
        ),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class Home extends Component {
    render() {
        const { swapiFetching } = this.props;

        return (
            <Layout title='Песочница'>
                <Spinner spin={ swapiFetching } />
                <Catcher>
                    <AntReduxForm />
                </Catcher>
            </Layout>
        );
    }
}

export default Home;
