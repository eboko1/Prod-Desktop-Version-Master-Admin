// vendor
import styled from 'styled-components';

// own
import { ROW_HEIGHT } from './dashboardConfig';

// helpers
const _loadStatus = load => {
    switch (true) {
        case load < 10:
            return 'var(--db_progress)';
        case load >= 10 && load < 60:
            return 'var(--db_approve)';
        case load >= 60 && load < 80:
            return 'var(--db_required)';
        case load >= 80:
            return 'var(--db_reserve)';
        default:
            return 'var(--secondary)';
    }
};

// styled-components
export const Dashboard = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-gap: 1%;
    overflow-y: hidden;
`;

export const DashboardGrid = styled.div`
    display: grid;
    position: relative;
    grid-template-columns: ${props =>
        `repeat(${props.columns}, minmax(13%, 1fr))`};
    grid-gap: 1%;
    width: auto;
    overflow-x: scroll;
    overflow-y: hidden;

    &::-webkit-scrollbar {
        width: 0.8em;
        position: absolute;
        height: 0.8em;
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--primary);
        position: absolute;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid #ccc;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: linear-gradient(to left, #fff, var(--primary));
        border: 1px solid #aaa;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: var(--primary);
    }
    &::-webkit-scrollbar-thumb:active {
        background: linear-gradient(to left, #fff, var(--primary));
    }
`;

export const DashboardColumn = styled.div`
    padding: 2px;
    background: #f1f1f2;
    border: ${props =>
        `${props.currentDay &&
            props.currentDay === props.day &&
            '2px solid var(--secondary)'}`};
    width: 100%;
    @media screen and (max-width: 1199px) {
        position: ${props =>
            `${props.currentDay &&
                props.currentDay === props.day &&
                'absolute'}`};
    }
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

/* eslint-disable func-names */
export const DashboardAddOrderColumn = styled.div`
    display: grid;
    grid-template-rows: ${props =>
        `repeat(${props.dashboard.rows}, ${ROW_HEIGHT}px)`};
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    background-color: ${function({
        mode,
        daysWithConflicts,
        stationsWithConflicts,
        day,
        stationNum,
        globalPosition,
    }) {
        if (mode === 'calendar') {
            if (daysWithConflicts.includes(day)) {
                return globalPosition % 2
                    ? 'rgba(var(--warningRGB), 0.3)'
                    : 'rgba(var(--warningRGB), 0.4)';
            }

            return 'white';
        }
        if (stationsWithConflicts.includes(stationNum)) {
            return globalPosition % 2
                ? 'rgba(var(--warningRGB), 0.3)'
                : 'rgba(var(--warningRGB), 0.4)';
        }

        return 'white';
    }};

    & div:nth-child(odd) {
        background-color: ${function({
        mode,
        daysWithConflicts,
        stationsWithConflicts,
        day,
        stationNum,
        globalPosition,
    }) {
        if (mode === 'calendar') {
            if (daysWithConflicts.includes(day)) {
                return globalPosition % 2
                    ? 'rgba(var(--warningRGB), 0.3)'
                    : 'rgba(var(--warningRGB), 0.4)'; // not 0.5 cuz of overlayed backgrounds
            }

            return 'var(--snow)';
        }
        if (stationsWithConflicts.includes(stationNum)) {
            return globalPosition % 2
                ? 'rgba(var(--warningRGB), 0.3)'
                : 'rgba(var(--warningRGB), 0.4)';
        }

        return 'var(--snow)';
    }};
    }
`;

export const DashboardHead = styled.div`
    height: 50px;
    color: black;
    font-weight: bold;
    text-align: center;
`;

export const DashboardTitle = styled.div`
    background-color: white;
    color: var(--primary);
    font-weight: bold;
    font-size: 12px;
`;

export const DashboardLoad = styled.div`
    background-color: ${props => _loadStatus(props.loadCoefficient)};
    text-transform: capitalize;
    text-decoration: ${props => props.link ? 'underline' : 'none'};
    cursor: ${props => props.link ? 'pointer' : 'default'};
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 4px 0;
    pointer-events: ${props => props.link ? 'auto' : 'none'};
`;

export const DashboardTimeCell = styled.div`
    height: ${ROW_HEIGHT}px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;

    &:nth-child(even) {
        background: var(--snow);
    }
`;
