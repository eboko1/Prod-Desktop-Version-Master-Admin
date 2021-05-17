/**
 * ringostat constants
 * Call statuses
 */
const callsStatuses = Object.freeze({
    VOICEMAIL:        'VOICEMAIL',
    ANSWERED:         'ANSWERED',
    NO_EXTENSION:     'NO EXTENSION',
    FAILED:           'FAILED',
    NO_ANSWER:        'NO ANSWER',
    CLIENT_NO_ANSWER: 'CLIENT NO ANSWER',
    REPEATED:         'REPEATED',
    NO_FORWARD:       'NO-FORWARD',
    PROPER:           'PROPER',
    BUSY:             'BUSY',
});

const answered = [ callsStatuses.ANSWERED, callsStatuses.PROPER, callsStatuses.REPEATED ];
const missed = [ callsStatuses.NO_ANSWER, callsStatuses.BUSY ]; //Busy calls are missed too
const busy = [ callsStatuses.BUSY ];

const all = [ ...answered, ...missed, ...busy ];

const config = {
    all:      [ all ],
    answered: [ answered ],
    missed:   [ missed ],
    busy:     [ busy ],
};

export { callsStatuses, answered, missed, busy, all, config };
