/**
 * Created by thram on 21/01/17.
 */
import React, {Component} from "react";
import {debounce, times} from "lodash";
import {connect} from "react-thrux";
import {observe} from "thrux";
import Markdown from "./Markdown";
import Menu from "./Menu";

class App extends Component {
  state = {menuOpen: false};

  toggleMenu = () => this.setState({menuOpen: !this.state.menuOpen});

  componentDidMount = () => observe('route', () => this.setState({menuOpen: false}));

  render = () => (
      <div className="container">
        <a onClick={this.toggleMenu} className="menu-btn">
          <div className={`nav-icon ${this.state.menuOpen && 'open'}`}>
            {times(4, (index) => <span key={index}/>)}
          </div>
        </a>
        <div className="side-bar" style={this.state.menuOpen ? {display: 'block'} : {}}>
          <a href="#" className="logo">
            <img src="https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo.png" alt="Thrux"/>
          </a>
          <Menu />
          <a href="https://github.com/Thram/thrux" className="github-logo">
            <img src="https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/GitHub-Mark-Light-120px-plus.png"
                 alt="Github"/>
          </a>
        </div>
        <div className="content">
          <Markdown page={this.props.route}/>
        </div>
      </div>
  )
}

export default connect('route', App);