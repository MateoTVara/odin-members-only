import { $ } from "../utils/index.js";

const loginForm = $('.login-form');
const signupForm = $('.signup-form');
const HIDDEN_CSS_CLASS = 'hidden';

const loginToggleBtn = loginForm?.querySelector('.form-footer > button');
const signupToggleBtn = signupForm?.querySelector('.form-footer > button');

const showLogin = () => {
  loginForm?.classList.remove(HIDDEN_CSS_CLASS);
  signupForm?.classList.add(HIDDEN_CSS_CLASS);
};

const showSignup = () => {
  signupForm?.classList.remove(HIDDEN_CSS_CLASS);
  loginForm?.classList.add(HIDDEN_CSS_CLASS);
};

loginToggleBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  showSignup();
});
signupToggleBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  showLogin();
});

const active = $('.form-container')?.dataset.activeForm;
if (active === 'signup') {
  showSignup();
} else {
  showLogin();
}