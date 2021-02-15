// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Input } from "antd";
import { permissions, isForbidden } from "utils";

// proj
import { Catcher } from "commons";

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
    render() {
        const { user, intl: { formatMessage } } = this.props;

        const pageData = [
        	{
        		title: 'Сгенерировать',
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
        				disabled: true,
        			},
        			{
        				title: 'Оплата',
        				disabled: true,
        			},
        			{
        				title: 'Возврат',
        				disabled: true,
        			},
        			{
        				title: 'Диагностика',
        				disabled: true,
        			},
        			{
        				title: 'Цех',
        				disabled: true,
        			}
        		]
        	},
        	{
        		title: 'Автомобиль',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: true,
        			},
        			{
        				title: 'Создать н/3',
        				disabled: true,
        			},
        		]
        	},
        	{
        		title: 'Товар',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: false,
        			},
        			{
        				title: 'Добавить в н/з',
        				disabled: false,
        			},
        			{
        				title: 'Принять на склад',
        				disabled: false,
        			},
        			{
        				title: 'Выдать в цех',
        				disabled: false,
        			},
        			{
        				title: 'Вернуть из цеха',
        				disabled: false,
        			}
        		]
        	},
        	{
        		title: 'Работа',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: true,
        			},
        			{
        				title: 'Добавить в н/з',
        				disabled: true,
        			},
        			{
        				title: 'Начать в текущем н/з',
        				disabled: true,
        			},
        			{
        				title: 'Окончить в текущем н/з',
        				disabled: true,
        			},
        			{
        				title: 'Прервать в текущем н/з',
        				disabled: true,
        			}
        		]
        	},
        	{
        		title: 'Сотрудник',
        		childs: [
        			{
        				title: 'Начать смену',
        				disabled: true,
        			},
        			{
        				title: 'Окончить смену',
        				disabled: true,
        			},
        			{
        				title: 'Начать перерыв',
        				disabled: true,
        			},
        			{
        				title: 'Окончить перерив',
        				disabled: true,
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
