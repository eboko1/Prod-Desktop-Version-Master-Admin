// vendor
import React from 'react';

// own
import moment from 'moment';

const FormattedDatetime = ({ datetime, format }) => (
    <div>
        { datetime
            ? moment(datetime).format(format ? format : 'DD.MM.YYYY HH:mm')
            : '-' }
    </div>
);

export default FormattedDatetime;
