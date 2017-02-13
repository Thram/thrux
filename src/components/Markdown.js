/**
 * Created by thram on 9/02/17.
 */
import React, {Component} from "react";
import {Converter} from "showdown";
import showdownHighlight from "showdown-highlight";
import {getMarkdown} from "../modules/routes";

const converter = new Converter({extensions: [showdownHighlight]});
converter.setFlavor('github');

export default class Markdown extends Component {
  render = () => (
    <div className="markdown-body"
         dangerouslySetInnerHTML={{
           __html: converter.makeHtml(getMarkdown(this.props.page))
         }}></div>
  )
}
