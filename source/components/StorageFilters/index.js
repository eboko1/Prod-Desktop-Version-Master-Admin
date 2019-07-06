// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Catcher } from 'commons';

// proj
import {
    SearchField,
    StatusRadioButtons,
    DatePickerField,
} from 'forms/_formkit';

const statuses = [ 'NEW', 'DONE' ];

export const StorageFilters = props => {
    return (
        <Catcher>
            <section>
                <FormattedMessage id='storage.created_datetime' />
                <DatePickerField
                    date={ props.filters.createdDatetime }
                    onChange={ date =>
                        props.setFilters({
                            createdDatetime: date,
                        })
                    }
                />
                <FormattedMessage id='storage.record_date' />
                <DatePickerField
                    date={ props.filters.recordDatetime }
                    onChange={ date =>
                        props.setFilters({
                            recordDatetime: date,
                        })
                    }
                />
                <FormattedMessage id='storage.done_date' />
                <DatePickerField
                    date={ props.filters.doneDatetime }
                    onChange={ date =>
                        props.setFilters({
                            doneDatetime: date,
                        })
                    }
                />
                <SearchField setFilters={ props.setFilters } />
                <StatusRadioButtons
                    status={ props.filters.status }
                    statuses={ statuses }
                    setFilters={ props.setFilters }
                />
            </section>
        </Catcher>
    );
};
