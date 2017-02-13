/**
 * Created by Thram on 14/02/17.
 */
import {capitalize, lowerCase} from "lodash";

export const humanize = (string) => capitalize(lowerCase(string));