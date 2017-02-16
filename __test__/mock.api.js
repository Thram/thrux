/**
 * Created by thram on 16/02/17.
 */

const DELAY = {
  min: 1000,
  max: 2000
};


const getDelay = () => Math.random() * DELAY.max + DELAY.min;

export const createAPI = (payload) => new Promise((resolve, reject) =>
    setTimeout(() => resolve(payload), getDelay()));

export const createAPIError = (error) => new Promise((resolve, reject) =>
    setTimeout(() => reject({error}), getDelay()));



