/**
 * Created by Thram on 14/02/17.
 */
import {sortBy, find, omitBy, snakeCase} from "lodash";
import {dispatch, register, createDict} from "thrux";

const reqPages = require.context("../pages", true, /^(.*\.(md$))/);

const getRoute = (file) => {
  const path  = file.replace('.md', ''),
        group = path.split('/'),
        label = group.pop().replace('#', '');

  return {
    file: file.replace('./', ''),
    path:`#${snakeCase(path)}`,
    group,
    label
  };
};

const ROUTES = reqPages.keys().map((k) => getRoute(k));

const getPage = (page) => find(ROUTES, {path: page}) || find(ROUTES, {label: '404'});


export const getCurrent = () => location.hash || ROUTES[0].path;

export const getMarkdown = (page) => require(`../pages/${ getPage(page).file}`);

const change = createDict(() => getCurrent());

register({
  route: {
    INIT  : change,
    CHANGE: change
  }
});

window.onhashchange = () => dispatch('route:CHANGE');

export default sortBy(omitBy(ROUTES, (r) => r.label === '404'), 'key');
