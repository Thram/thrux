/**
 * Created by thram on 21/01/17.
 */
import React, {Component} from "react";
import {dispatch} from "thrux";
import {connect} from "react-thrux";


class App extends Component {

  render() {
    return (
        <div style={styles.container}>
          TEST!
        </div>
    )
  }
}

const styles = {
  container: {
    fontFamily: "Helvetica, Arial, sans-serif"
  },

  clickArea: {
    padding   : '20px',
    width     : '200px',
    height    : '200px',
    border    : '1px solid black',
    background: 'teal'
  },
  column   : {
    padding: '20px',
    display: 'inline-block',
    float  : 'left'
  }
};

export default connect('counter', App);