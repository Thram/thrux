/**
 * Created by thram on 21/01/17.
 */
import {register, createDict} from "thrux";

register({
  counter: {
    INCREASE: createDict((payload, state) => (state || 0) + 1),
    DECREASE: createDict((payload, state) => (state > 0) ? state - 1 : 0),
    RESET   : createDict((payload, state) => 0)
  }
});