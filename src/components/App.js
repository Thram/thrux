/**
 * Created by thram on 21/01/17.
 */
import React, {Component} from "react";
import {debounce} from "lodash";
import {connect} from "react-thrux";
import Markdown from "./Markdown";
import Menu from "./Menu";

class App extends Component {
  render = () => (
      <div className="container">
        <div className="side-bar">
          <a href="#" className="logo">
            <img src="https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo_sm.png" alt="Thrux"/>
          </a>
          <Menu />
          <a href="https://github.com/Thram/thrux" className="github-logo">
            <img src="https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/GitHub-Mark-Light-120px-plus.png"
                 alt="Github"/>
          </a>
        </div>
        <div className="content">
          <Markdown page={this.state.route}/>
        </div>
      </div>
  )
}

export default connect(['route'], App);