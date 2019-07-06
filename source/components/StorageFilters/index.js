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
    const { filters } = props;

    return (
        <Catcher>
            <section>
                <FormattedMessage id='storage.created_datetime' />
                <DatePickerField
                    date={ filters.createdDatetime }
                    onChange={ date =>
                        props.setFilters({
                            createdDatetime: date,
                            recordDatetime:  void 0,
                            doneDatetime:    void 0,
                        })
                    }
                />
                <FormattedMessage id='storage.record_date' />
                <DatePickerField
                    date={ filters.recordDatetime }
                    onChange={ date =>
                        props.setFilters({
                            createdDatetime: void 0,
                            recordDatetime:  date,
                            doneDatetime:    void 0,
                        })
                    }
                />
                <FormattedMessage id='storage.done_date' />
                <DatePickerField
                    date={ filters.doneDatetime }
                    onChange={ date =>
                        props.setFilters({
                            createdDatetime: void 0,
                            recordDatetime:  void 0,
                            doneDatetime:    date,
                        })
                    }
                />
                <SearchField setFilters={ props.setFilters } />
                <StatusRadioButtons
                    status={ filters.status }
                    statuses={ statuses }
                    setFilters={ props.setFilters }
                />
            </section>
        </Catcher>
    );
};
