// vendor
import React from 'react';
import { Checkbox, Form } from 'antd';
import styled from 'styled-components';

// own
const FormItem = Form.Item;
const StyledCheckbox = styled(Checkbox)`
    display: ${props => props.hidden && 'none'};
`;

export class DecoratedCheckbox extends React.PureComponent {
    render() {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            hasFeedback,
            formItemLayout,
            getFieldDecorator,
            disabled,
            rules,
            field,
            initialValue,
            children,
            onChange,
            hidden,
        } = this.props;

        const checkbox = getFieldDecorator(field, {
            valuePropName: 'checked',
            initialValue:  Boolean(initialValue),
            rules,
        })(
            <StyledCheckbox
                disabled={ disabled }
                onChange={ onChange }
                hidden={ hidden }
            >
                { children }
            </StyledCheckbox>,
        );

        return formItem ? (
            <FormItem
                label={ label }
                hasFeedback={ hasFeedback }
                colon={ colon }
                className={ className }
                { ...formItemLayout }
            >
                { checkbox }
            </FormItem>
        ) : 
            checkbox
        ;
    }
}
