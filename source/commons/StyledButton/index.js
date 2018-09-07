// vendor
import React from 'react';
import { Button as AntButton } from 'antd';
import styled from 'styled-components';

const Button = ({
    type,
    icon,
    loading,
    onClick,
    disabled,
    className,
    children,
}) => {
    return (
        <AntButton
            type={ type }
            icon={ icon }
            className={ className }
            loading={ loading }
            onClick={ () => onClick }
            disabled={ disabled }
        >
            { children }
        </AntButton>
    );
};

const _bgColor = type => {
    switch (type) {
        case 'primary':
            return 'var(--primary)';
        case 'secondary':
            return 'var(--secondary)';
        case 'link':
            return 'var(--link)';

        default:
            return 'white';
    }
};

const _textColor = type => {
    switch (type) {
        case 'primary':
            return 'white';
        case 'secondary':
            return 'white';
        case 'link':
            return 'white';

        default:
            return 'var(--text)';
    }
};

const _borderColor = type => {
    switch (type) {
        case 'primary':
            return 'var(--primary)';
        case 'secondary':
            return 'var(--secondary)';
        case 'link':
            return 'var(--link)';

        default:
            return 'var(--primary)';
    }
};

const _hoveredColor = (type, alpha) => {
    switch (type) {
        case 'primary':
            return 'rgba(var(--primaryRGB), .8)';
        case 'secondary':
            return `rgba(var(--secondaryRGB), ${alpha})}`;
        case 'link':
            return 'rgba(var(--linkRGB), .8)';

        default:
            return 'rgba(var(--primaryRGB), .8)';
    }
};

export const StyledButton = styled(Button)`
    background-color: ${props => _bgColor(props.type)};
    color: ${props => _textColor(props.type)};
    border: ${props => `1px solid ${_borderColor(props.type)}`};

    &:hover,
    &:focus {
        color: ${props => _textColor(props.type)};
        border: ${props => `1px solid ${_borderColor(props.type)}`};
        background-color: ${props => _hoveredColor(props.type, 0.8)};
    }

    &:active {
        color: ${props => _textColor(props.type)};
        border: ${props => `1px solid ${_borderColor(props.type)}`};
        background-color: ${props => _hoveredColor(props.type, 1)};
    }
`;

export default StyledButton;
