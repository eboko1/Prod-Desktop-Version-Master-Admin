import styled from 'styled-components';
import { ROW_HEIGHT } from './dashboardConfig';

export const Dashboard = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-gap: 1%;
    background: #f7f7f7;
`;

export const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: ${props =>
        `repeat(${props.columns}, minmax(13%, 1fr))`};
    grid-gap: 1%;
    width: auto;
    overflow-x: scroll;
    background: #ddd;
`;

export const DashboardColumn = styled.div`
    padding: 10px;
    background: lightblue;
    border: ${props =>
        `${props.currentDay &&
            props.currentDay === props.day &&
            '2px solid var(--secondary)'}`};
    ${'' /* display: grid;
    grid-template-rows: ${props =>
        `repeat(${props.dashboard.rows}, ${ROW_HEIGHT}px)`};
    grid-template-columns: ${props => `repeat(${props.column}, 1fr)`}; */};
`;

export const DashboardBody = styled.div`
    display: grid;
    grid-template-columns: 90% 10%;
`;

export const DashboardContentColumn = styled.div`
    background: yellowgreen;
    display: grid;
    grid-template-rows: ${props =>
        `repeat(${props.dashboard.rows}, ${ROW_HEIGHT}px)`};
`;

export const DashboardContentBox = styled.div`
    display: grid;
    grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
    grid-template-rows: ${props => `repeat(${props.rows}, ${ROW_HEIGHT}px)`};
    grid-row: ${props => `span ${props.rows}`};
`;

export const DashboardAddOrderColumn = styled.div`
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
`;

export const DashboardTimeCell = styled.div`
    height: ${ROW_HEIGHT}px;
    border-bottom: 1px dashed red;
    background-color: #1eaafc;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// grid-template-columns: ${props =>
//     `repeat(${props.column}, 1fr) ${!props.time ? '10%' : ''}`};
