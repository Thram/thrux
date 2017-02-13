/**
 * Created by thram on 21/01/17.
 */
import React from "react";
import ReactDOM from "react-dom";
import {addMiddleware} from "thrux";
import logger from "thrux-logger";
import App from "./components/App";
import "./theme/default.sass";
addMiddleware(logger);
ReactDOM.render(<App />, document.getElementById('thrux-docs'));