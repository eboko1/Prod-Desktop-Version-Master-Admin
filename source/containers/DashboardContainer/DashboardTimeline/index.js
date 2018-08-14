// vendor
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const DashboardTimeline = ({ schedule }) => {
    if (
        ~~moment().format('H') >= schedule.beginHour &&
        ~~moment().format('H') <= 21
        // ~~moment().format('H') <= schedule.endHour
    ) {
        return <StyledDashboardTimeline time={ schedule.beginHour } />;
    }

    return null;
};

const StyledDashboardTimeline = styled.hr`
    height: 0px;
    position: absolute;
    left: 0;
    right: 0;
    border: none;
    z-index: 1;
    margin: 0;
    border-bottom: 2px solid #526e82;
    top: ${props =>
        `${(~~moment().format('H') - props.time + moment().format('m') / 60) *
            60 +
            110}px`};
`;

export default DashboardTimeline;
