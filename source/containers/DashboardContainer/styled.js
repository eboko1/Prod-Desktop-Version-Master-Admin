import styled from 'styled-components';
import { ROW_HEIGHT } from './dashboardConfig';

export const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: 80px repeat(7, 1fr);
    grid-gap: 10px;
    background: #f7f7f7;
`;

export const DashboardColumn = styled.div`
    padding: 10px;
    background: lightblue;
    border: 1px solid blue;
    display: grid;
    grid-template-rows: ${props =>
        `repeat(${props.dashboard.rows}, ${ROW_HEIGHT}px)`};
    grid-template-columns: ${props => `repeat(${props.column}, 1fr)`};
`;

export const DashboardBody = styled.div`
    display: flex;
`;

export const DashboardContentColumn = styled.div`
    flex: 0 0 90%;
    background: yellowgreen;
`;

export const DashboardContentBox = styled.div`
    display: grid;
    grid-template-columns: ${props =>
        `repeat(${props.dashboard.columns}, 1fr)`};
    grid-column: ${props => `span ${props.dashboard.columns}`};
`;

export const DashboardAddOrderColumn = styled.div`
    flex: 0 0 10%;
    display: grid;
    grid-template-rows: ${props =>
        `repeat(${props.dashboard.rows}, ${ROW_HEIGHT}px)`};
`;

export const DashboardHead = styled.div`
    background-color: #1eaafc;
    background-image: linear-gradient(160deg, #6c52d9 0%, #9b8ae6 127%);
    border: 1px dashed black;
    height: ${ROW_HEIGHT}px;
    color: white;
    text-align: center;
    grid-column: ${props => `span ${props.column + 1}`};
`;

// grid-template-columns: ${props =>
//     `repeat(${props.column}, 1fr) ${!props.time ? '10%' : ''}`};
