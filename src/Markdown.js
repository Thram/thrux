/**
 * Created by thram on 9/02/17.
 */
import React, {Component} from "react";
import {Converter}  from 'showdown';

const converter = new Converter();
converter.setFlavor('github');

const getMarkdown = (page) => require(`./pages/${ page || 'home' }.md`);


export default class Markdown extends Component {
  render = () => (
      <div className="markdown-body"
           dangerouslySetInnerHTML={{
             __html: converter.makeHtml(getMarkdown(this.props.page))
           }}></div>
  )
}
