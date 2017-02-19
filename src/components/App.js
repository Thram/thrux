/**
 * Created by thram on 21/01/17.
 */
import React, {Component} from "react";
import {debounce} from "lodash";
import {connect} from "react-thrux";
import {observe} from "thrux";
import Markdown from "./Markdown";
import Menu from "./Menu";

class App extends Component {
  state = {menuOpen: false};

  openMenu = () => this.setState({menuOpen: true});

  goHome = () => this.state.menuOpen ? this.setState({menuOpen: false}): location.hash='#';

  componentDidMount = () => observe('route', () => this.setState({menuOpen: false}));

  render = () => (
      <div className="container">
        <a onClick={this.openMenu} className="menu-logo" style={this.state.menuOpen ? {display: 'none'} : {}}>
          <img src="https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/thrux_icon.png" alt="Menu"/>
        </a>
        <div className="side-bar" style={this.state.menuOpen ? {display: 'block'} : {}}>
          <a onClick={this.goHome} className="logo">
            <img src="https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo.png" alt="Thrux"/>
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