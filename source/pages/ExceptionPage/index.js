// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

// Proj
import { Layout } from 'commons';
import book from 'routes/book';
import { images } from 'utils';

import Styles from './styles.m.css';

class Exception extends Component {
    getErrorImage = statusCode => {
        switch (statusCode) {
            case '400':
                return images.exception400;

            case '403':
                return images.exception400;

            case '404':
                return images.exception404;

            case '500':
                return images.exception500;

            default:
                return images.exception404;
        }
    };

    render() {
        const statusCode = this.props.match.params.statusCode;

        return (
            <Layout
                title={ <FormattedMessage id='exception-page.title' /> }
                paper={ false }
            >
                <div className={ Styles.error }>
                    <div className={ Styles.errorImage }>
                        <img src={ this.getErrorImage(statusCode) } alt='error' />
                    </div>
                    <div className={ Styles.errorData }>
                        <h1 className={ Styles.errorCode }>{ statusCode }</h1>
                        <span className={ Styles.errorDesc }>
                            error description
                        </span>
                        <Link to={ book.ordersAppointments }>
                            <Button type='primary'>
                                <FormattedMessage id='exception-page.back_to_main' />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Exception;
