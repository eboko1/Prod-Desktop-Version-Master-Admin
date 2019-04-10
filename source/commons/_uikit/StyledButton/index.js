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
            onClick={ onClick }
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
        case 'warning':
            return 'var(--warning)';
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
        case 'warning':
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
        case 'warning':
            return 'var(--warning)';
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
        case 'warning':
            return 'rgba(var(--warningRGB), .8)';
        case 'link':
            return 'rgba(var(--linkRGB), .8)';

        default:
            return 'rgba(var(--primaryRGB), .8)';
    }
};

const _activeColor = type => {
    switch (type) {
        case 'primary':
            return 'rgba(var(--primaryDarkRGB), 1)';
        case 'secondary':
            return 'rgba(var(--secondaryDarkRGB), 1)}';
        case 'warning':
            return 'rgba(var(--warningRGB), 1)}';
        case 'link':
            return 'rgba(var(--linkRGB), 1)';

        default:
            return 'rgba(var(--primaryDarkRGB), 1)';
    }
};

export const StyledButton = styled(Button)`
    background-color: ${props => _bgColor(props.type)};
    color: ${props => _textColor(props.type)};
    border: ${props => `1px solid ${_borderColor(props.type)}`};
    border-radius: ${props => props.resetRadius && 0};

    &:hover,
    &:focus {
        color: ${props => _textColor(props.type)};
        border: ${props => `1px solid ${_borderColor(props.type)}`};
        background-color: ${props => _hoveredColor(props.type, 0.8)};
    }

    &:active {
        background-color: ${props => _activeColor(props.type, 1)};
    }
`;
