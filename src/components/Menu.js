/**
 * Created by Thram on 13/02/17.
 */
import React, {Component} from "react";
import {uniqueId, groupBy, map} from "lodash";
import {humanize} from "../modules/utils";
import ROUTES, {getCurrent} from "../modules/routes";

class Menu extends Component {
  render = () => {
    const current = getCurrent();
    return (
      <div className="menu">
        {map(groupBy(ROUTES, 'group'), (routes, group) => (
          <div key={uniqueId('list_item_')} className="group">
            {group && <h3>{humanize(group)}</h3>}
            <ul>
              {routes.map((route, index) => <li key={uniqueId('list_item_')}><a
                className={current === route.path && 'active'} href={route.path}>{route.label}</a>
              </li>)}
            </ul>
          </div>))}
      </div>
    )
  }
}

export default Menu;