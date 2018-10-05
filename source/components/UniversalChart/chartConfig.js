export const chartMode = Object.freeze({
    SALES:                { type: 'cur' }, // Продажи (грн)
    AVERAGE_SALES:        { type: 'cur' }, // Средний чек (грн)
    LOAD:                 { type: 'per' }, // Загрузка постов (%),
    APPOINTMENT_APPROVE:  { type: 'per' }, // Обращения в Записи (%)
    APPROVE_PROGRESS:     { type: 'per' }, //  Записи в Ремонты (%)
    INVITE_APPROVE:       { type: 'per' }, // Приглашения в Записи (%)
    APPOINTMENT_PROGRESS: { type: 'per' }, // Обращения в Ремонты (%)
    REVIEWS:              { type: 'per' }, // Общий NPS (%)
    PERM_CLIENTS:         { type: 'per' }, // Постоянных клиентов (%)
    APPOINTMENT:          { type: 'pc' }, // Кол-во Обращений (шт)
    APPROVE:              { type: 'pc' }, // Кол-во Записей (шт)
    PROGRESS:             { type: 'pc' }, // Кол-во Ремонтов (шт)
    STACK_CALLS:          { type: 'pc' }, // Зависшие “Новые” (шт.)
    APPOINTMENTS:         { type: 'auto' }, // Загрузка постов (авто)
    CALLS_REACTION:       { type: null }, // Ø реакция на звонки
});

export const chartPeriod = Object.freeze({
    DAY:   'day',
    WEEK:  'week',
    MONTH: 'month',
});
