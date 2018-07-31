import styled from 'styled-components';
import { ROW_HEIGHT } from './dashboardConfig';

export const Dashboard = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-gap: 1%;
`;

export const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: ${props =>
        `repeat(${props.columns}, minmax(13%, 1fr))`};
    grid-gap: 1%;
    width: auto;
    overflow-x: scroll;
`;

export const DashboardColumn = styled.div`
    padding: 2px;
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
    display: grid;
    grid-template-rows: ${props =>
        `repeat(${props.dashboard.rows}, ${ROW_HEIGHT}px)`};
    border: 1px solid black;
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
    height: 50px;
    color: white;
    text-align: center;
`;

export const DashboardTitle = styled.div`
    background-color: white;
    color: var(--primary);
    font-weight: bold;
    font-size: 12px;
`;

const _loadStatus = load => {
    switch (true) {
        case load >= 80:
            return 'var(--not_complete)';
        case load >= 40 && load < 80:
            return 'var(--approve)';
        case load < 40:
            return 'var(--secondary)';
        default:
            return 'var(--secondary)';
    }
};

export const DashboardLoad = styled.div`
    background-color: ${props => _loadStatus(props.loadCoefficient)};
    text-transform: capitalize;
    text-decoration: underline;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 4px 0;
`;

export const DashboardTimeCell = styled.div`
    height: ${ROW_HEIGHT}px;
    border-bottom: 1px dashed black;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// grid-template-columns: ${props =>
//     `repeat(${props.column}, 1fr) ${!props.time ? '10%' : ''}`};
