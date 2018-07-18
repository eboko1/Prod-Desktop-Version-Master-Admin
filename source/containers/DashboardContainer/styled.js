import styled from 'styled-components';

export const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
`;

export const Wrapper = styled.section`
    padding: 1em;
    background: papayawhip;
`;

export const Input = styled.div.attrs({
    // we can define static props
    // type: 'password',

    // or we can define dynamic ones
    margin:  props => props.size || '1em',
    padding: props => props.size || '1em',
})`
    color: palevioletred;
    font-size: 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;

    /* here we use the dynamically computed props */
    margin: ${props => props.margin};
    padding: ${props => props.padding};
`;

export const DashboardColumn = styled.div`
    padding: 10px;
    background: lightblue;
    border: 1px solid blue;
    display: grid;
    /* here we use the dynamically computed props */
    grid-template-rows: ${props => `repeat(${props.dashboard.rows}, 1fr)`};
    grid-template-columns: ${props =>
        `repeat(${props.dashboard.columns}, 1fr)`};
`;

export const DashboardHead = styled.div.attrs({
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

export const DashboardCell = styled.div.attrs({
    gridtemplaterows: 'repeat(22, 30px)',
})`
    grid-template-rows: ${props => props.gridTemplateRows};
`;

// export const DashboardCon

// export const DashboardEmptyCell = styled.div.attrs({
//     gridtemplaterows: 'repeat(22, 30px)',
// })`
//     grid-template-rows: ${props => props.gridTemplateRows};
// `;
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
`;

// export const DashboardContent = styled.div.attrs({})`
//     display: grid;
//     grid-row: span 3;
//     grid-template-columns: repeat(3, 1fr);
//     grid-template-rows: 30px 30px;
// `;

/* grid-column-start: auto;
grid-row-start: auto; */
/* grid-template-rows: repeat(12, 60px); */
