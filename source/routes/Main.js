// vendor
import React, { Component } from "react";
import { hot } from "react-hot-loader";

// proj
import { getToken, getBusinessTypes } from "utils";

// own
import Private from "./Private";
import Public from "./Public";
import { TireFittingRoutes } from "tireFitting";

@hot(module)
export default class Routes extends Component {
    render() {
        const businessTypes = getBusinessTypes();
        return  !getToken() ?
                    <Public /> : 
                    businessTypes == "TIRE_STATION" ? 
                        <TireFittingRoutes /> :
                        <Private /> ;
    }
}
