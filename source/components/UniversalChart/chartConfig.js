export const chartMode = Object.freeze({
    SALES:                { mode: 'SALES', type: 'cur' }, // Продажи (грн)
    AVERAGE_SALES:        { mode: 'AVERAGE_SALES', type: 'cur' }, // Средний чек (грн)
    LOAD:                 { mode: 'LOAD', type: 'per' }, // Загрузка постов (%),
    APPOINTMENT_APPROVE:  { mode: 'APPOINTMENT_APPROVE', type: 'per' }, // Обращения в Записи (%)
    APPROVE_PROGRESS:     { mode: 'APPROVE_PROGRESS', type: 'per' }, // Записи в Ремонты (%)
    INVITE_APPROVE:       { mode: 'INVITE_APPROVE', type: 'per' }, // Приглашения в Записи (%)
    APPOINTMENT_PROGRESS: { mode: 'APPOINTMENT_PROGRESS', type: 'per' }, // Обращения в Ремонты (%)
    REVIEWS:              { mode: 'REVIEWS', type: 'per' }, // Общий NPS (%)
    PERM_CLIENTS:         { mode: 'PERM_CLIENTS', type: 'per' }, // Постоянных клиентов (%)
    APPOINTMENT:          { mode: 'APPOINTMENT', type: 'pc' }, // Кол-во Обращений (шт)
    APPROVE:              { mode: 'APPROVE', type: 'pc' }, // Кол-во Записей (шт)
    PROGRESS:             { mode: 'PROGRESS', type: 'pc' }, // Кол-во Ремонтов (шт)
    STACK_CALLS:          { mode: 'STACK_CALLS', type: 'pc' }, // Зависшие “Новые” (шт.)
    APPOINTMENTS:         { mode: 'APPOINTMENTS', type: 'auto' }, // Загрузка постов (авто)
    CALLS_REACTION:       { mode: 'CALLS_REACTION', type: 'min' }, // Ø реакция на звонки
});

export const chartList = Object.freeze({
    kpi: [
        chartMode.SALES,
        chartMode.AVERAGE_SALES,
        chartMode.LOAD,
        chartMode.APPOINTMENT_PROGRESS,
        chartMode.PERM_CLIENTS,
        chartMode.REVIEWS,
    ],
    calls: [ chartMode.CALLS_REACTION, chartMode.STACK_CALLS ],
    load:  [
        chartMode.APPOINTMENTS,
        chartMode.APPOINTMENT,
        chartMode.APPROVE,
        chartMode.PROGRESS,
    ],
    conversion: [ chartMode.APPOINTMENT_APPROVE, chartMode.APPROVE_PROGRESS, chartMode.INVITE_APPROVE ],
});

export const chartPeriod = Object.freeze({
    DAY:   'day',
    WEEK:  'week',
    MONTH: 'month',
});
