// vendor
import React from 'react';
import { Input, Icon, Form } from 'antd';

// own
const FormItem = Form.Item;
const Search = Input.Search;

export class DecoratedSearch extends React.PureComponent {
    render() {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            hasFeedback,
            formItemLayout,
            innerRef,
            onSearch,
            onPressEnter,
            enterButton,

            cnStyles,
            getFieldDecorator,
            disabled,
            rules,
            type,
            placeholder,
            icon,
            iconType,
            field,
            initialValue,
            style,
            onChange,
        } = this.props;

        const search = getFieldDecorator(field, {
            ...initialValue ? { initialValue } : { initialValue: void 0 },
            rules,
        })(
            <Search
                className={ cnStyles || className }
                prefix={
                    icon ? (
                        <Icon
                            type={ iconType }
                            style={ {
                                color: 'rgba(0,0,0,.25)',
                            } }
                        />
                    ) : null
                }
                style={ style }
                type={ type }
                placeholder={ placeholder }
                disabled={ disabled }
                onChange={ onChange }
                ref={ innerRef }
                onSearch={ onSearch }
                onPressEnter={ onPressEnter }
                enterButton={ enterButton }
            />,
        );

        return formItem ? (
            <FormItem
                label={ label }
                hasFeedback={ hasFeedback }
                colon={ colon }
                className={ className }
                { ...formItemLayout }
            >
                { search }
            </FormItem>
        ) : 
            search
        ;
    }
}
