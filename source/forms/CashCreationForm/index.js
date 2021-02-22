// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Icon, Row, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { createCashbox } from 'core/cash/duck';
import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';

// own
import { cashboxTypes } from './config';
import Styles from './styles.m.css';
const Option = Select.Option;

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const formItemStyle = {
	labelAlign: 'left',
	style: {
		marginBottom: 4,
		display: 'flex',
		alignItems: 'center',
	},
};

@injectIntl
@Form.create()
@connect(null, { createCashbox })
export class CashCreationForm extends Component {
	_submit = () => {
		const { form, createCashbox } = this.props;
		form.validateFields((err, values) => {
			if (!err) {
				createCashbox(values);
				form.resetFields();
			}
		});
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { formatMessage } = this.props.intl;

		return (
			<Form
				layout='horizontal'
				className={Styles.form}
				onSubmit={this._submit}
				id='cash-creation-form'
			>
				<Form.Item
					label={<FormattedMessage id='cash-creation-form.name' />}
					{...formItemStyle}
					{...formItemLayout}
				>
					<DecoratedInput
						field='name'
						rules={[
							{
								required: true,
								message: formatMessage({
									id: 'cash-creation-form.name.validation',
								}),
							},
						]}
						getFieldDecorator={getFieldDecorator}
						cnStyles={Styles.field}
					/>
				</Form.Item>
				<Form.Item
					label={<FormattedMessage id='cash-creation-form.type' />}
					{...formItemStyle}
					{...formItemLayout}
				>
					<DecoratedSelect
						field='type'
						getFieldDecorator={getFieldDecorator}
						initialValue={cashboxTypes.CASH}
						cnStyles={Styles.field}
						getPopupContainer={() =>
							document.getElementById('cash-creation-form')
						}
					>
						{Object.values(cashboxTypes).map((item) => (
							<Option value={item} key={item}>
								{formatMessage({
									id: `cash-creation-form.type-${item}`,
								})}
							</Option>
						))}
					</DecoratedSelect>
				</Form.Item>
				<Form.Item
					label={<FormattedMessage id='cash-creation-form.fiscalNumber' />}
					{...formItemStyle}
					{...formItemLayout}
				>
					<DecoratedInput
						field='fiscalNumber'
						rules={[
							{
								required: true,
								message: formatMessage({
									id: 'cash-creation-form.fiscalNumber.validation',
								}),
							},
						]}
						getFieldDecorator={getFieldDecorator}
						cnStyles={Styles.field}
					/>
				</Form.Item>
				<Form.Item
					label={<FormattedMessage id='cash-creation-form.description' />}
					{...formItemStyle}
					{...formItemLayout}
				>
					<DecoratedInput
						fields={{}}
						cnStyles={Styles.field}
						field='description'
						getFieldDecorator={getFieldDecorator}
					/>
				</Form.Item>
			</Form>
		);
	}
}
