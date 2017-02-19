/**
 * Created by thram on 21/01/17.
 */
import React, {Component} from "react";
import {debounce} from "lodash";
import {connect} from "react-thrux";
import {register, createDict, dispatch} from "thrux";
import Markdown from "./Markdown";
import Menu from "./Menu";

class App extends Component {
  render = () => (
    <div className="container">
      <a href="https://github.com/Thram/thrux" className="github-logo">
        <img src="https://raw.githubusercontent.com/Thram/thrux/assets/GitHub-Mark-120px-plus.png" alt="Github"/>
      </a>
      <div className="side-bar" style={this.state.app.sideBar}>
        <a href="#" className="logo">
          <img src="https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo_sm.png" alt="Thrux"/>
        </a>
        <Menu />
      </div>
      <div className="content" style={this.state.app.content}>
        <Markdown page={this.state.route}/>
      </div>
    </div>
  )
}

const SIDE_BAR_WIDTH = 200,
      SIDE_BAR_LIMIT = .4;

const updateStyles = createDict(() => {
  const sideBarRatio = 200 / document.body.clientWidth;
  return {
    sideBar: {
      overflow: 'hidden',
      width   : sideBarRatio < SIDE_BAR_LIMIT ? `${SIDE_BAR_WIDTH}px` : '0'
    },
    content: {
      width: sideBarRatio < SIDE_BAR_LIMIT ? `${document.body.clientWidth - SIDE_BAR_WIDTH}px` : '100%'
    }
  };
});

register({
  app: {
    INIT         : updateStyles,
    UPDATE_STYLES: updateStyles
  }
});

window.addEventListener("resize", debounce(() => dispatch('app:UPDATE_STYLES'), 150));

export default connect(['route', 'app'], App);