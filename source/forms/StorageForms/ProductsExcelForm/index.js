// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Input, Table, Button, Icon } from "antd";
import _ from "lodash";
import styled from "styled-components";

// own
import { ProductsExcelTable } from "components";
import { DecoratedInputNumber } from "forms/DecoratedFields";
import { Loader } from "commons";

const ButtonGroup = styled.div`
    display: flex;
    margin: 8px 0;
    justify-content: flex-end;
`;

const SubmitButton = styled(Button)`
    width: 30%;
    margin: 0 auto;
`;

@injectIntl
@Form.create()
export class ProductsExcelForm extends Component {
    _submit = event => {
        event.preventDefault();

        const { form } = this.props;

        this.props.form.validateFieldsAndScroll(
            { scroll: { offsetBottom: 50 } },
            // { scroll: { offsetBottom: 50 }, force: true },
            (err, values) => {
                if (!err) {
                    const normalizedFields = _.toPairs(values).reduce(
                        (result, [name, value]) => {
                            return _.set(result, name, value);
                        },
                        [],
                    );
                }
            },
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const buttonGroup = this._renderButtonGroup();

        return (
            <Form onSubmit={this._submit}>
                {buttonGroup}
                <ProductsExcelTable
                    dataSource={this.props.dataSource}
                    getFieldDecorator={getFieldDecorator}
                />
                {this.props.dataSource && this.props.dataSource.length >= 20 ? (
                    <SubmitButton type="primary" htmlType="submit">
                        {this.props.intl.formatMessage({ id: "submit" })}
                    </SubmitButton>
                ) : null}
            </Form>
        );
    }

    _renderButtonGroup = () => {
        return (
            <ButtonGroup>
                {!_.isEmpty(this.props.dataSource) && (
                    <SubmitButton type="primary" htmlType="submit">
                        {this.props.intl.formatMessage({ id: "submit" })}
                    </SubmitButton>
                )}
                <Button
                    icon="rollback"
                    onClick={() => this.props.productsExcelImportReset()}
                >
                    {this.props.intl.formatMessage({ id: "back" })}
                </Button>
            </ButtonGroup>
        );
    };
}
