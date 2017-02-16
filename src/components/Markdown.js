/**
 * Created by thram on 9/02/17.
 */
import React, {Component} from "react";
import Prism from "prismjs";
import {getMarkdown} from "../modules/routes";

import marked, {Renderer} from "marked";
marked.setOptions({
  renderer   : new Renderer(),
  gfm        : true,
  tables     : true,
  breaks     : true,
  pedantic   : true,
  sanitize   : true,
  smartLists : true,
  smartypants: true,
  highlight  : (code) => Prism.highlight(code, Prism.languages.js)
});

export default class Markdown extends Component {
  render = () => (
      <div className="markdown-body"
           dangerouslySetInnerHTML={{
             __html: marked(getMarkdown(this.props.page))
           }}></div>
  )
}
