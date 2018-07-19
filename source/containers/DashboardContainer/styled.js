// vendor
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// proj
import book from 'routes/book';

export const DashboardColumn = styled.div`
    padding: 10px;
    background: lightblue;
    border: 1px solid blue;
    display: grid;
    /* here we use the dynamically computed props */
    grid-template-rows: ${props => `repeat(${props.dashboard.rows}, 1fr)`};
    grid-template-columns: ${props =>
        `repeat(${props.dashboard.columns - 1}, 1fr) 10%`};
`;

export const DashboardHead = styled.div.attrs({
    // we can define static props
    // type: 'password',

    // or we can define dynamic ones
    gridcolumn: props => props.dashboard ? props.dashboard.columns : 1,
})`
    background-color: #1eaafc;
    background-image: linear-gradient(160deg, #6c52d9 0%, #9b8ae6 127%);
    border: 1px dashed black;
    /* padding: 4px;
    margin: 4px; */
    height: 30px;
    color: white;
    grid-column: ${props => `span ${props.gridcolumn}`};
`;

export const DashboardEmptyCell = styled.div`
    min-height: 30px;
    border-bottom: 1px dashed red;
    background-color: #1eaafc;
    background-image: linear-gradient(
        130deg,
        #6c52d9 0%,
        #1eaafc 85%,
        #3edfd7 100%
    );
    grid-column: ${props => `span ${props.dashboard.columns - 1}`};
`;

export const DashboardAddOrderCell = styled.div`
    background-color: tomato;
    border: 1px solid red;
`;

const AddOrderLink = ({ className, children }) => (
    <Link to={ book.addOrder } className={ className }>
        { children }
    </Link>
);
export const DashboardAddOrderLink = styled(AddOrderLink)`
    display: none;
    color: palevioletred;
    background: papayawhip;
    height: 30px;
    width: 10%;
    position: absolute;
    transform: translate(-90%);

    ${DashboardAddOrderCell}:hover & {
        display: flex;
    }
`;

//// grid-row: 2 after head / +2 why?
// export const DashboardAddOrderColumn = styled.div`
//     display: grid;
//     background-color: #ddd;
//     grid-column: ${props => props.dashboard.columns};
//     grid-row: 2 / ${props => props.dashboard.rows + 2};
// `;

// export const DashboardHead = styled.div`
//     background-color: #1eaafc;
//     background-image: linear-gradient(160deg, #6c52d9 0%, #9b8ae6 127%);
//     border: 1px dashed black;
//     /* padding: 4px;
//     margin: 4px; */
//     height: 30px;
//     color: white;
//     grid-column: ${props => props.dashboard.columns};
// `;
// export const DashboardColumn = styled.div.attrs({
//     // we can define static props
//     // type: 'static prop',
//
//     // margin: props => props.size || '1em',
//     // gridTemplateRows: 'repeat(22, 30px)', Warning: React does not recognize the `gridTemplateRows` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `gridtemplaterows` instead. If you
//     // gridtemplaterows: 'repeat(22, 30px)',
//     gridtemplaterows:    props => `repeat(${props.dashboard.rows}, 1fr`,
//     gridtemplatecolumns: props => `repeat(${props.dashboard.columns}, 1fr)`,
// })`
//     padding: 10px;
//     background: lightblue;
//     border: 1px solid blue;
//     display: grid;
//     /* here we use the dynamically computed props */
//     grid-template-rows: ${props => props.gridtemplaterows};
// `;

// export const DashboardCell = styled.div.attrs({
//     gridtemplaterows: 'repeat(22, 30px)',
// })`
//     grid-template-rows: ${props => props.gridTemplateRows};
// `;

// export const DashboardCon

// export const DashboardEmptyCell = styled.div.attrs({
//     gridtemplaterows: 'repeat(22, 30px)',
// })`
//     grid-template-rows: ${props => props.gridTemplateRows};
// `;

// export const DashboardContent = styled.div.attrs({})`
//     display: grid;
//     grid-row: span 3;
//     grid-template-columns: repeat(3, 1fr);
//     grid-template-rows: 30px 30px;
// `;

/* grid-column-start: auto;
grid-row-start: auto; */
/* grid-template-rows: repeat(12, 60px); */
