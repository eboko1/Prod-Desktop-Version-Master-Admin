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

const answered = [ 'VOICEMAIL', 'ANSWERED', 'REPEATED' ];
const missed = [ 'NO_EXTENSION', 'FAILED', 'NO_ANSWER', 'CLIENT_NO_ANSWER', 'NO_FORWARD' ];
const busy = [ 'BUSY' ];

const all = [ ...answered, ...missed, ...busy ];

export { callsStatuses, answered, missed, busy, all };
