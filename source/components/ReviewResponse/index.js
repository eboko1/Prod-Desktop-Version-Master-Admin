// Core
import React, { Component } from 'react';
import { Textarea } from 'antd';

// proj
import { Catcher, StyledButton } from 'commons';

export default class ReviewResponse extends Component {
    render() {
        const { text } = this.props;

        return (
            <Catcher>
                <div>
                    <div>
                        <div>Отзыв</div>
                        <div>{ text }</div>
                    </div>
                    <div>
                        <div>Ответ клиенту</div>
                        <div>textarea</div>
                        <StyledButton type='secondary'>
                            Отправить ответ
                        </StyledButton>
                    </div>
                    <div>
                        <p>
                            Есть сомнение по поводу данного отзыва? Отправьте
                            жалобу для проверки
                        </p>
                        <StyledButton type='secondary'>
                            Пожаловаться
                        </StyledButton>
                    </div>
                </div>
            </Catcher>
        );
    }
}
