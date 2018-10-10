// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Input } from 'antd';

// proj
import { Catcher, StyledButton } from 'commons';

// own
import Styles from './styles.m.css';
const { TextArea } = Input;

export default class ReviewResponse extends Component {
    render() {
        const { text, complaint } = this.props;

        return (
            <Catcher>
                <div className={ Styles.reviewResponse }>
                    <div className={ Styles.block }>
                        <div className={ Styles.title }>
                            <FormattedMessage id='review-response.feedback' />
                        </div>
                        <div>{ text }</div>
                    </div>
                    <div className={ `${Styles.block} ${Styles.response}` }>
                        <div className={ Styles.title }>
                            <FormattedMessage id='review-response.respond_to_customer' />
                        </div>
                        <TextArea rows={ 4 } />
                        <StyledButton
                            type='secondary'
                            className={ Styles.sendResponse }
                        >
                            <FormattedMessage id='review-response.send_response' />
                        </StyledButton>
                    </div>
                    <div
                        className={ `${Styles.complain} ${complaint &&
                            Styles.complainted}` }
                    >
                        <div>
                            <div>
                                <FormattedMessage id='review-response.complain_text-1' />
                            </div>
                            <div>
                                <FormattedMessage id='review-response.complain_text-2' />
                            </div>
                        </div>
                        <StyledButton
                            type='warning'
                            className={ Styles.complainBtn }
                        >
                            <FormattedMessage id='review-response.complain' />
                        </StyledButton>
                    </div>
                </div>
            </Catcher>
        );
    }
}
