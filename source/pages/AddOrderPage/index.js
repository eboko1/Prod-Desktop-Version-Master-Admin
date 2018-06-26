// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Button, Radio } from 'antd';

// proj
import { fetchAddOrderForm } from 'core/forms/addOrderForm/duck';
import { Layout } from 'commons';
import { AddOrderForm } from 'forms';

//  own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// import Styles from './styles.m.css';

// const mapStateToProps = (state, props) => {
//     return {
//         posts:
//         managers:
//         clients:
//         paymentMethod:
//     };
// };
//
@withRouter
@connect(null, { fetchAddOrderForm })
class AddOrderPage extends Component {
    componentDidMount() {
        this.props.fetchAddOrderForm();
    }
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='add-order-page.add_order' /> }
                controls={
                    <>
                        <div>
                            <RadioGroup>
                                <RadioButton value='reserve'>
                                    Reserve
                                </RadioButton>
                                <RadioButton value='new'>New</RadioButton>
                                <RadioButton value='questionable'>
                                    Questionable
                                </RadioButton>
                                <RadioButton value='approved'>
                                    Approved
                                </RadioButton>
                            </RadioGroup>,
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </div>
                        <Icon
                            style={ { fontSize: 24, cursor: 'pointer' } }
                            type='close'
                            onClick={ () => this.props.history.goBack() }
                        />
                    </>
                }
            >
                <AddOrderForm />
            </Layout>
        );
    }
}

export default AddOrderPage;
