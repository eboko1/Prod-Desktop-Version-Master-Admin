import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const Datetime = styled.div`
    display: flex;
    flex-direction: column;
    width: 75px;
`;

export default ({ datetime }) => (
    <Datetime>{ moment(datetime).format('DD.MM.YYYY HH:mm') }</Datetime>
);
