// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Input } from "antd";
import { permissions, isForbidden, fetchAPI } from "utils";

// proj
import { Catcher } from "commons";
import { Barcode } from "components";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class BarcodeContainer extends Component {
	constructor(props) {
        super(props);
        this.state = {
            inputCode: undefined,
        };
	}
	
    render() {
        const { user, intl: { formatMessage } } = this.props;
		const { inputCode } = this.state;

        const pageData = [
        	{
        		title: 'Присвоить',
        		childs: [
        			{
        				title: 'Код товара',
        				disabled: false,
        			},
        			{
        				title: 'Код сотрудника',
        				disabled: false,
        			},
        			{
        				title: 'Код а/м',
        				disabled: false,
        			},
        			{
        				title: 'Код ячейки',
        				disabled: false,
        			}
        		]
        	},
        	{
        		title: 'Документ',
        		childs: [
        			{
        				title: 'Открыть',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Оплата',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Возврат',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Диагностика',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Цех',
        				disabled: !inputCode,
        			}
        		]
        	},
        	{
        		title: 'Автомобиль',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Создать н/3',
        				disabled: !inputCode,
        			},
        		]
        	},
        	{
        		title: 'Товар',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Добавить в н/з',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Принять на склад',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Выдать в цех',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Вернуть из цеха',
        				disabled: !inputCode,
        			}
        		]
        	},
        	{
        		title: 'Работа',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Добавить в н/з',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Начать в текущем н/з',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Окончить в текущем н/з',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Прервать в текущем н/з',
        				disabled: !inputCode,
        			}
        		]
        	},
        	{
        		title: 'Сотрудник',
        		childs: [
        			{
        				title: 'Начать смену',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Окончить смену',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Начать перерыв',
        				disabled: !inputCode,
        			},
        			{
        				title: 'Окончить перерив',
        				disabled: !inputCode,
        			}
        		]
        	}
        ]

        return (
            <Catcher>
	            <div className={Styles.container}>
	                <div className={Styles.barcodeInput}>
	                	<Input
	                		placeholder={formatMessage({id: 'Введите или отсканируйте штрих-код'})}
							value={inputCode}
							onChange={({target})=>{
								this.setState({
									inputCode: target.value,
								})
							}}
	                	/>
                        <Barcode
                            iconStyle={{
                                marginLeft: 14,
								fontSize: 24,
                            }}
							value={inputCode}
							onConfirm={(value)=>
								this.setState({
									inputCode: value,
								})
							}
                        />
	                </div>
	                <div className={Styles.buttonBlockWrapp}>
	                	{pageData.map(({title, childs}, key)=>(
	                		<div key={key} className={Styles.buttonBlock}>
	                			<div className={Styles.buttonBlockTitle}>
	                				<FormattedMessage id={title} />
	                			</div>
	                			{childs.map(({title, disabled}, index)=>(
	                				<div key={`${key}-${index}`} className={Styles.buttonWrapp}>
		                				<Button
		                					type='primary'
		                					disabled={disabled}
		                					className={Styles.button}
		                					style={{width: '100%'}}
		                				>
		                					<FormattedMessage id={title} />
		                				</Button>
	                				</div>
	                			))}
	                		</div>
	                	))}
	                </div>
                </div>
            </Catcher>
        );
    }
}
