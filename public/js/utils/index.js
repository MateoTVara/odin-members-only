const $ = (selector) => {
  try {
    if (typeof selector !== 'string') throw new Error('Selector must be a string');
    return document.querySelector(selector);
  } catch (error) {
    console.log(error);
  }
}

const $$ = (selector) => {
  try {
    if (typeof selector !== 'string') throw new Error('Selector must be a string');
    return document.querySelectorAll(selector);
  } catch (error) {
    console.log(error);
  }
}

export { $, $$ };