// core
import React from 'react';
import styled from 'styled-components';

const StyledPaper = ({ children, className }) => (
    <section className={ className }>{ children }</section>
);

export const Paper = styled(StyledPaper)`
    margin: ${props => props.margin};
    padding: ${props => props.padding};
    min-height: ${props => props.minHeight};
    overflow: ${props => props.overflow};
    background-color: ${props => props.backgroundColor};
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px,
        rgba(0, 0, 0, 0.23) 0px 3px 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

Paper.defaultProps = {
    margin:          '24px 16px',
    padding:         '10px',
    minHeight:       '50px',
    overflow:        'initial',
    backgroundColor: 'rgb(255, 255, 255)',
};
