// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';

export const GoBack = ({ link }) => (
    <Link to={ link }>
        <Button type='default'>
            <Icon type='arrow-left' />
            <FormattedMessage id='go_back' />
        </Button>
    </Link>
);
