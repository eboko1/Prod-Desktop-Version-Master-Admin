// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Icon } from "antd";

// proj
import { setPage } from "core/myTasks/duck";

import { Catcher } from "commons";
import { permissions, isForbidden } from "utils";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class DiagnosticPatternsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    render() {
        return (
            <Catcher>
                <div>dd</div>
            </Catcher>
        );
    }
}
