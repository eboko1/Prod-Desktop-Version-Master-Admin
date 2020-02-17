// vendor
import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Tabs, Button, Icon} from 'antd';

// proj
import {Layout, Spinner, MobileView, ResponsiveView, StyledButton} from 'commons';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        spinner: state.ui.orderFetching,
    };
};

const mapDispatchToProps = {
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)

class DiagnosticPatternsPage extends Component {
    render() {
        const {
            spinner,
        } = this.props;

        return spinner ? (
            <Spinner spin={ spinner }/>
        ) : (
            <Layout
                title={ <FormattedMessage id='diagnostic-page.title' /> }
                controls={
                    <Button
                        type='primary'
                        onClick={ () =>
                            alert('test')
                        }
                    >
                        <FormattedMessage id='diagnostic-page.add_new_template' />
                    </Button>
                }
            >
            </Layout>
        );
    }
}

export default DiagnosticPatternsPage;