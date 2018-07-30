import _ from 'lodash';
import moment from 'moment-timezone';

const TIMEZONE = 'Europe/Kiev';

const mapOrders = (beginHour, orders) =>
    _(orders)
        .filter('beginDatetime')
        .map(({ duration, beginDatetime, id }) => {
            const numberOfHalfHours =
                Math.ceil(moment.duration(duration).asHours() * 2) || 1;

            const momentBeginDatetime = moment(beginDatetime).tz(TIMEZONE);

            const beginHours = momentBeginDatetime.hours();
            const beginMinutes = momentBeginDatetime.minutes();

            const openHalfHoursQuantity =
                moment.duration(`${beginHour}:00:00`).asHours() * 2;
            const orderBeginHalfHoursQuantity =
                moment.duration(`${beginHours}:${beginMinutes}:00`).asHours() *
                2;

            const startHalfHour = Math.ceil(
                orderBeginHalfHoursQuantity - openHalfHoursQuantity,
            );

            if (startHalfHour < 0) {
                if (startHalfHour + numberOfHalfHours < 1) {
                    return null;
                }

                return {
                    position: 0,
                    quantity: startHalfHour + numberOfHalfHours,
                    id,
                };
            }

            return { position: startHalfHour, quantity: numberOfHalfHours, id };
        })
        .filter(Boolean)
        .value();

export default mapOrders;
