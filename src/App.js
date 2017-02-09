/**
 * Created by thram on 21/01/17.
 */
import React, {Component} from "react";
import Markdown from "./Markdown";

const getPage = () => location.hash.replace('#', '');

class App extends Component {
  state = {
    page: getPage()
  };

  componentDidMount = () => window.onhashchange = () => this.setState({page: getPage()});

  render = () => (
      <div className="container">
        <div className="side-bar">
          <a href="#home">Home</a>
          <a href="#test">Test</a>
          <a href="#test2">Test 2</a>
        </div>
        <div className="content">
          <Markdown page={this.state.page}/>
        </div>

      </div>
  )
}

export default App;