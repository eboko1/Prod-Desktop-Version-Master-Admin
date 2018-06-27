// Core
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'antd';

import { swapiActions } from 'core/swapi/actions';
// import { uiActions } from 'core/ui/actions';

// Components
import { Layout, Spinner, Catcher } from 'commons';
// import { , LanguagePad } from 'components';
// import { AntReduxForm } from 'forms';

import { UniversalFiltersForm } from 'forms';

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
class SwapiBox extends Component {
    // componentDidMount() {
    //     this.props.actions.fetchSwapi();
    // }

    _getData = () => this.props.actions.fetchSwapi();

    render() {
        const { swapiFetching, swapi } = this.props;

        return (
            <Layout title='Песочница'>
                { /* <Spinner spin={ swapiFetching } /> */ }
                <Catcher>
                    { /* <LanguagePad /> */ }
                    { /* <Button type='primary' onClick={ () => this._getData() }>
                        get data
                    </Button> */ }
                    { /* <pre className='language-bash'>
                        { JSON.stringify(swapi, null, 2) }
                    </pre> */ }
                    { /* <AntReduxForm /> */ }
                    <UniversalFiltersForm />
                </Catcher>
            </Layout>
        );
    }
}

export default SwapiBox;
