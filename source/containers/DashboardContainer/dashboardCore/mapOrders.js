import _ from 'lodash';
import moment from 'moment-timezone';

const TIMEZONE = 'Europe/Kiev';

const mapOrders = (beginHour, maxRows, orders) =>
    _(orders)
        .filter('beginDatetime')
        .map((order) => {
            const { duration, beginDatetime } = order;
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

            let quantity = numberOfHalfHours;
            let position = startHalfHour;

            if (startHalfHour < 0) {
                if (startHalfHour + numberOfHalfHours < 1) {
                    return null;
                }

                position = 0;
                quantity = startHalfHour + numberOfHalfHours;
            }

            if (startHalfHour + numberOfHalfHours >= maxRows) {
                if (startHalfHour >= maxRows) {
                    return null;
                }

                quantity = maxRows - startHalfHour;
            }

            return { position, quantity, options: order };
        })
        .filter(Boolean)
        .value();

export default mapOrders;
