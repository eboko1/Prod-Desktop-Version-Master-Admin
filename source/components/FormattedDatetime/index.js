// vendor
import React from 'react';

// own
import moment from 'moment';

const FormattedDatetime = ({ datetime }) =>(<div>
    { datetime
        ? moment(datetime).format('DD.MM.YYYY HH:mm')
        : '-' }
</div>);

export default FormattedDatetime;
