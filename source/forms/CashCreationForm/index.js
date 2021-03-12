// vendor
import React, { Component } from 'react';
import { Form, Select, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';

// own
import { cashboxTypes } from './config';
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
@Form.create()
export class CashCreationForm extends Component {
	constructor(props) {
		super(props);

		props.getFormRefCB && props.getFormRefCB(this.props.form); //Callback to get form's refference
	}

	/**
	 * This method generates styled and structured row 
	 * @param {*} label     The component which represents label(like any div, h1, h2, h3 and other tags)
	 * @param {*} component The component to be placed as a main input or select(pass Form item in it)
	 * @returns 
	 */
	generateStyledContentRow(label, component) {
		return (
			<Row className={Styles.row}>
				<Col className={Styles.label} span={8}>
					{label}
				</Col>

				<Col className={Styles.content} span={16}>
					{component}
				</Col>
			</Row>
		);
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { formatMessage } = this.props.intl;

		return (
			<Form
				id='cash-creation-form'
			>
					
				{/* ------------------------------------------------------------- */}
				{this.generateStyledContentRow(
					(<span><FormattedMessage id='cash-creation-form.name' />:</span>),
					(
						<DecoratedInput
							field='name'
							formItem
							rules={[
								{
									required: true,
									message: formatMessage({id: 'cash-creation-form.name.validation'}),
								},
							]}
							getFieldDecorator={getFieldDecorator}
							className={Styles.formItemStyle}
						/>
					)
				)}
				{/* ------------------------------------------------------------- */}

				{/* ------------------------------------------------------------- */}
				{this.generateStyledContentRow(
					(<span><FormattedMessage id='cash-creation-form.type' />:</span>),
					(
						<DecoratedSelect
							field='type'
							formItem
							getFieldDecorator={getFieldDecorator}
							initialValue={cashboxTypes.CASH}
							className={Styles.formItemStyle}
							getPopupContainer={() =>
								document.getElementById('cash-creation-form')
							}
						>
							{Object.values(cashboxTypes).map((item) => (
								<Option value={item} key={item}>
									{formatMessage({id: `cash-creation-form.type-${item}`})}
								</Option>
							))}
						</DecoratedSelect>
					)
				)}
				{/* ------------------------------------------------------------- */}
				
				{/* ------------------------------------------------------------- */}
				{this.generateStyledContentRow(
					(<span><FormattedMessage id='cash-creation-form.fiscal_number' />:</span>),
					(
						<DecoratedInput
							field='fiscalNumber'
							formItem
							rules={[
								{
									len: 10,
									message: formatMessage({id: 'cash-creation-form.fiscal_number_too_short'}),
								},
								{
									pattern: /^\d+$/,
									message: formatMessage({id: 'cash-creation-form.fiscal_number_digits_only'}),
								}
							]}
							className={Styles.formItemStyle}
							getFieldDecorator={getFieldDecorator}
						/>
					)
				)}
				{/* ------------------------------------------------------------- */}

				{/* ------------------------------------------------------------- */}
				{this.generateStyledContentRow(
					(<span><FormattedMessage id='cash-creation-form.description' />:</span>),
					(
						<DecoratedInput
							field='description'
							formItem
							rules={[]} //If you will not provide this you won't be aple to enter text into this input
							className={Styles.formItemStyle}
							getFieldDecorator={getFieldDecorator}
						/>
					)
				)}
				{/* ------------------------------------------------------------- */}
						
			</Form>
		);
	}
}
