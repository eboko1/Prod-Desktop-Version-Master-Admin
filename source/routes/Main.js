// vendor
import React, { Component } from "react";
import { hot } from "react-hot-loader";

// proj
import { getToken } from "utils";

// own
import Private from "./Private";
import Public from "./Public";

@hot(module)
export default class Routes extends Component {
    render() {
        return !getToken() ? <Public /> : <Private />;
    }
}
