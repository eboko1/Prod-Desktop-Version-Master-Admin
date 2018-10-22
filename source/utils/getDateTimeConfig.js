// vendor
import _ from 'lodash';

const defaultDateTimeConfig = {
    beginTime: '08:00',
    endTime:   '23:00',
};

// to disable all hours, when date is not selected
const defaultNullDateTimeConfig = {
    beginTime: '-1:00',
    endTime:   '-1:00',
};

export const getDateTimeConfig = (datetime, availableDateTimeConfigs) => {
    // TODO validate availableDateTimeConfigs

    // || 7, because Sunday (moment) equals 0, Sunday (api.carbook) equals 7
    const providedDateTimeConfig = datetime
        ? _.find(
            availableDateTimeConfigs,
            config =>
                config.days.includes(datetime.day() || 7) &&
                  (config.beginTime && config.endTime || config.h24),
        )
        : defaultNullDateTimeConfig;

    const dateTimeConfig = providedDateTimeConfig || defaultDateTimeConfig;

    const availableHours = Array.from(Array(24).keys());
    const availableMinutes = Array.from(Array(60).keys());

    const [ beginHour, beginMinute ] = (dateTimeConfig.h24
        ? '00:00'
        : dateTimeConfig.beginTime
    )
        .split(':')
        .map(Number);

    const [ endHour, endMinute ] = (dateTimeConfig.h24
        ? '23:59'
        : dateTimeConfig.endTime
    )
        .split(':')
        .map(Number);

    const findConfig = momentDate =>
        _.find(
            availableDateTimeConfigs,
            config =>
                config.days.includes(momentDate.day() || 7) &&
                (config.beginTime && config.endTime || config.h24),
        );

    const disabledDate = momentDate => {
        return momentDate && !findConfig(momentDate);
    };

    const disabledHours = () =>
        availableHours.filter(hour => hour < beginHour || hour > endHour);

    const disabledMinutes = hour => {
        if (hour > beginHour && hour < endHour) {
            return [];
        } else if (hour === beginHour && hour === endHour) {
            return availableMinutes.filter(
                minute => minute < beginMinute || minute > endMinute,
            );
        } else if (hour === beginHour) {
            return availableMinutes.filter(minute => minute < beginMinute);
        } else if (hour === endHour) {
            return availableMinutes.filter(minute => minute > endMinute);
        }

        return availableMinutes;
    };

    const disabledSeconds = (hour, minute) => {
        const disabledMinutesValues = disabledMinutes(hour);
        if (disabledMinutesValues.includes(minute)) {
            return Array.from(Array(60).keys());
        }

        return [];
    };

    return {
        disabledTime: () => ({
            disabledSeconds,
            disabledMinutes,
            disabledHours,
        }),
        disabledDate,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        beginTime: dateTimeConfig.h24 ? '00:00' : dateTimeConfig.beginTime,
        endTime:   dateTimeConfig.h24 ? '23:59' : dateTimeConfig.endTime,
    };
};
