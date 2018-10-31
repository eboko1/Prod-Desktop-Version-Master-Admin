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

/**
 * Generate time config for moment
 * @param {Integer} hours number of hours
 * @param {Integer?} minutes number of minutes
 * @param {Boolean} start start/end of time config
 * @returns {{hours: *, minutes: number, seconds: number, milliseconds: number}}
 */
const getTimeConfig = (hours, minutes, start) => ({
    hours,
    minutes:      !_.isNil(minutes) ? minutes : start ? 0 : 59,
    seconds:      start ? 0 : 59,
    milliseconds: start ? 0 : 999,
});

/**
 * Validate if interval is in disabled range
 * @param {Moment} datetime date to which timepicker is binded
 * @param {{hours: *, minutes: number, seconds: number, milliseconds: number}} startTimeConfig
 * @param {{hours: *, minutes: number, seconds: number, milliseconds: number}} endTimeConfig
 * @param {object} range mapConfigToRange
 * @returns {boolean} is disabled
 */
const isIntervalDisabled = (
    datetime,
    startTimeConfig,
    endTimeConfig,
    range,
) => {
    if ([ datetime, startTimeConfig, endTimeConfig, range ].some(_.isNil)) {
        return false;
    }

    const startDatetime = datetime.clone().set(startTimeConfig);
    const endDatetime = datetime.clone().set(endTimeConfig);

    const hourDisabledRange = range.filter(({ begin, end }) => {
        const secBegin = begin.clone().set({ seconds: 0, milliseconds: 0 });
        const secEnd = end.clone().set({ seconds: 0, milliseconds: 0 });

        return (
            startDatetime.isSameOrAfter(secBegin) &&
            startDatetime.isSameOrBefore(secEnd) &&
            endDatetime.isSameOrAfter(secBegin) &&
            endDatetime.isSameOrBefore(secEnd)
        );
    });

    return Boolean(hourDisabledRange.length);
};

/**
 * Merge date and time moment objects
 * @param {Moment} momentDate take date from this arg
 * @param {Moment} momentTime take time from this arg
 * @returns {Moment} merge date and time
 */
const mergeDateTime = (momentDate, momentTime) => {
    const newDate = momentDate.clone();
    const { hours, milliseconds, minutes, seconds } = momentTime.toObject();

    return newDate.set({ milliseconds, seconds, hours, minutes });
};

/**
 * Add hours to moment date
 * @param {Moment} momentDate
 * @param {Number} hoursDuration number of hours
 * @returns {Moment} date with added hours
 */
const addDuration = (momentDate, hoursDuration) => {
    const newDate = momentDate.clone();
    const milliseconds = hoursDuration * 3600 * 1000;

    return newDate.add('milliseconds', milliseconds);
};

const mapConfigToRange = (datetimes = []) => {
    return datetimes
        .map(({ momentDate, momentTime, duration }) => {
            if (!momentDate || !momentTime || !duration) {
                return null;
            }

            const begin = mergeDateTime(momentDate, momentTime);
            const end = addDuration(begin.clone(), duration);
            const zero = begin
                .clone()
                .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

            return { begin: zero, end };
        })
        .filter(Boolean);
};

export const getDateTimeConfig = (
    datetime,
    availableDateTimeConfigs,
    disabledDatetimes,
) => {
    // TODO validate availableDateTimeConfigs
    const disabledRange = mapConfigToRange(disabledDatetimes);

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
        availableHours.filter(hour => {
            const startTimeConfig = getTimeConfig(hour, void 0, true);
            const endTimeConfig = getTimeConfig(hour, void 0, false);

            const disabled = isIntervalDisabled(
                datetime,
                startTimeConfig,
                endTimeConfig,
                disabledRange,
            );

            return hour < beginHour || hour > endHour || disabled;
        });

    const disabledMinutes = hour => {
        if (!hour) {
            return availableMinutes;
        }
        let scheduleDisabledMinutes = [];
        if (hour > beginHour && hour < endHour) {
            scheduleDisabledMinutes = [];
        } else if (hour === beginHour && hour === endHour) {
            scheduleDisabledMinutes = availableMinutes.filter(
                minute => minute < beginMinute || minute > endMinute,
            );
        } else if (hour === beginHour) {
            scheduleDisabledMinutes = availableMinutes.filter(
                minute => minute < beginMinute,
            );
        } else if (hour === endHour) {
            scheduleDisabledMinutes = availableMinutes.filter(
                minute => minute > endMinute,
            );
        }

        const rangeDisabledMinutes = availableMinutes.filter(minutes => {
            const startTimeConfig = getTimeConfig(hour, minutes, true);
            const endTimeConfig = getTimeConfig(hour, minutes, false);

            return isIntervalDisabled(
                datetime,
                startTimeConfig,
                endTimeConfig,
                disabledRange,
            );
        });

        return _.uniq([ ...scheduleDisabledMinutes, ...rangeDisabledMinutes ]);
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
