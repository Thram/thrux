/**
 * Created by thram on 9/02/17.
 */
import React, {Component} from "react";
import {Converter}  from 'showdown';

const converter = new Converter();
converter.setFlavor('github');


export default class Markdown extends Component {

  constructor(props) {
    super(props);
    this.markdown = require(`./pages/${ props.page || 'home' }.md`) ;
  }

  render = () => (
      <div className="markdown-body"
           dangerouslySetInnerHTML={{__html: converter.makeHtml(this.markdown)}}>

      </div>
  )
}
