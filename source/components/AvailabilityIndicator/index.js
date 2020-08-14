import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

@injectIntl
export default class AvailabilityIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { formatMessage } = this.props.intl;
        const indexArray = this.props.indexArray;

        let color = "brown",
            title = "Поставщик не выбран!";

        if (indexArray) {
            const in0 = indexArray[0],
                in1 = indexArray[1],
                in2 = indexArray[2],
                inX = indexArray[3];

            title =
                `${formatMessage({
                    id: "availabilities-page.avail_0",
                })}: ${in0} ${formatMessage({ id: "pc" })}\n` +
                `${formatMessage({
                    id: "availabilities-page.avail_1",
                })}: ${in1} ${formatMessage({ id: "pc" })}\n` +
                `${formatMessage({
                    id: "availabilities-page.avail_2",
                })}: ${in2} ${formatMessage({ id: "pc" })}\n` +
                `${formatMessage({
                    id: "availabilities-page.avail_x",
                })}: ${inX} ${formatMessage({ id: "pc" })}\n`;
            if (in0 != 0) {
                color = "var(--green)";
            } else if (in1 != 0) {
                color = "yellow";
            } else if (in2 != 0) {
                color = "orange";
            } else if (inX != 0) {
                color = "red";
            }
        } else {
            color = "grey";
        }

        return (
            <div
                style={{
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    backgroundColor: color,
                }}
                title={title}
            ></div>
        );
    }
}
