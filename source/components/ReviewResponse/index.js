// Core
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Input, Icon } from "antd";

// proj
import { Catcher, StyledButton, Loader } from "commons";

// own
import Styles from "./styles.m.css";
const { TextArea } = Input;

@injectIntl
export default class ReviewResponse extends Component {
    state = {
        complainMode: true,
        reply: null,
        complain: null,
    };

    _toggleComplainMode = () =>
        this.setState(state => ({
            complainMode: !state.complainMode,
        }));

    _handleReplyText = ({ target }) => this.setState({ reply: target.value });

    _handleComplainText = ({ target }) =>
        this.setState({ complain: target.value });

    _sendReply = () =>
        this.props.postReviewReply(this.props.id, this.state.reply);

    _sendComplain = () => {
        this._toggleComplainMode();
        this.props.postReviewComplain(this.props.id, this.state.complain);
    };

    render() {
        const {
            text,
            replyText,
            complaint,
            intl: { formatMessage },
        } = this.props;

        const renderComplain = this._renderComplain();

        return (
            <Catcher>
                <div className={Styles.reviewResponse}>
                    <div className={Styles.block}>
                        <div className={Styles.title}>
                            <FormattedMessage id="review-response.feedback" />
                        </div>
                        <div className={Styles.feedbackText}>{text}</div>
                    </div>
                    <div className={`${Styles.block} ${Styles.response}`}>
                        <div className={Styles.title}>
                            <FormattedMessage id="review-response.respond_to_customer" />
                        </div>
                        {!replyText ? (
                            <>
                                <TextArea
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                    onChange={event =>
                                        this._handleReplyText(event)
                                    }
                                    rules={[
                                        {
                                            max: 2000,
                                            message: formatMessage({
                                                id:
                                                    "field_should_be_below_2000_chars",
                                            }),
                                        },
                                    ]}
                                />
                                <StyledButton
                                    type="secondary"
                                    className={Styles.send}
                                    onClick={this._sendReply}
                                >
                                    <FormattedMessage id="review-response.send_response" />
                                </StyledButton>
                            </>
                        ) : (
                            <div className={Styles.feedbackText}>
                                {replyText}
                            </div>
                        )}
                        {!complaint ? (
                            renderComplain
                        ) : (
                            <div className={Styles.complained}>
                                <FormattedMessage id="review-response.complaint" />
                                {complaint && (
                                    <div className={Styles.complainText}>
                                        {complaint}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Catcher>
        );
    }

    _renderComplain = () => {
        const {
            reviewComplaintLoading,
            intl: { formatMessage },
        } = this.props;
        const { complainMode } = this.state;
        if (reviewComplaintLoading) {
            return <Loader loading={reviewComplaintLoading} />;
        }

        return complainMode ? (
            <div className={Styles.complain}>
                <div>
                    <div>
                        <FormattedMessage id="review-response.complain_text-1" />
                    </div>
                    <div>
                        <FormattedMessage id="review-response.complain_text-2" />
                    </div>
                </div>
                <StyledButton
                    type="warning"
                    className={Styles.complainBtn}
                    onClick={() => this._toggleComplainMode()}
                >
                    <FormattedMessage id="review-response.complain" />
                </StyledButton>
            </div>
        ) : (
            <div className={Styles.complained}>
                <Icon
                    type="close"
                    className={Styles.closeComplain}
                    onClick={() => this._toggleComplainMode()}
                />
                <TextArea
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    onChange={event => this._handleComplainText(event)}
                    rules={[
                        {
                            max: 2000,
                            message: formatMessage({
                                id: "field_should_be_below_2000_chars",
                            }),
                        },
                    ]}
                />
                <StyledButton
                    type="warning"
                    className={Styles.send}
                    onClick={() => this._sendComplain()}
                >
                    <FormattedMessage id="review-response.send_complaint" />
                </StyledButton>
            </div>
        );
    };
}
