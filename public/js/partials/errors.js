import { $, $$ } from '../utils/index.js';

const errorContainer = $('.error-messages');
const errors = $$('.error-message');

Promise.all(
  Array.from(errors).map(error => {
    return new Promise((resolve) => {
      setTimeout(() => {
        error.classList.toggle('removed');
      }, 5000);
      setTimeout(() => {
        error.remove();
        resolve();
      }, 6000);
    });
  })
).then(() => {
  if (errorContainer && errorContainer.children.length === 0) {
    errorContainer.remove();
  }
});