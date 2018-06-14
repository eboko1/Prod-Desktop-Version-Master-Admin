const moment = () => {
    return moment;
};

moment.now = () => 123456;
moment.locale = () => moment;
moment.calendar = () => moment;

export default moment;
