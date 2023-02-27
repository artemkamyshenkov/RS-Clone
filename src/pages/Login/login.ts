import './login.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { checkAuthStatus, handleLogout, resetPassword, signIn, signUp } from './../../server/firebaseAuth';
import qs from 'query-string';
import { PATH } from '../../app/app';
import { Lang } from '../../constans/constans';

export default class LoginPage extends Page {
  userNamePasswordWrap: HTMLElement;
  signInButton: HTMLButtonElement;
  signUpButton: HTMLButtonElement;
  submitButtonForSigIn: HTMLButtonElement;
  submitButtonForSigUp: HTMLButtonElement;
  resetPasswordLink: HTMLElement;
  userNameLabel: HTMLElement;
  constructor(id: string) {
    super(id);
    this.mainWrapper.className = 'error__wrap';
    const form = createHtmlElement('form', 'login__form', '', this.mainWrapper);
    const buttonsWrap = createHtmlElement('div', 'btns__wrap', '');
    const continueBtn = createHtmlElement('div', 'continue__btn', 'Continue', buttonsWrap);
    const changeUserBtn = createHtmlElement('div', 'change__user-btn', 'Change user', buttonsWrap);

    this.userNamePasswordWrap = createHtmlElement('div', 'user__mail-wrap', '', form);
    const userMailLabel = createHtmlElement('label', 'label__item', 'E-mail:', this.userNamePasswordWrap);
    const userMailInput = createHtmlElement('input', 'username', '', userMailLabel) as HTMLInputElement;
    userMailInput.setAttribute('type', 'text');
    userMailInput.setAttribute('required', '');
    userMailInput.setAttribute('pattern', `[a-zA-Z0-9._-]+@[a-zA-Z]+\\.[a-zA-Z]{2,3}`);
    const ErrorMessageMail = createHtmlElement('span', 'error__message', 'Invalid e-mail', userMailLabel);
    this.userNameLabel = createHtmlElement('label', 'user__name-label', 'Name:', this.userNamePasswordWrap);
    const userNameInput = createHtmlElement('input', 'username', '', this.userNameLabel) as HTMLInputElement;
    userNameInput.setAttribute('type', 'text');
    userNameInput.setAttribute('required', '');
    const ErrorMessageName = createHtmlElement('span', 'error__message', 'Enter your name, please.', this.userNameLabel);

    userNameInput.addEventListener('invalid', function (e: Event) {
      e.preventDefault();
      if (!userNameInput.validity.valid) {
        ErrorMessageName.classList.toggle('active');
        userNameInput.classList.toggle('invalid');
      }
    });
    userNameInput.addEventListener('input', function () {
      if (ErrorMessageName.classList.contains('active')) {
        ErrorMessageName.classList.toggle('active');
        userNameInput.classList.toggle('invalid');
      }
      if (userNameInput.classList.contains('invalid')) {
        userNameInput.classList.toggle('invalid');
      }
    });
    userNameInput.addEventListener('blur', function () {
      if (!userNameInput.validity.valid) {
        ErrorMessageName.classList.toggle('active');
        userNameInput.classList.toggle('invalid');
      }
    });

    userMailInput.addEventListener('invalid', function (e: Event) {
      e.preventDefault();
      if (!userMailInput.validity.valid) {
        ErrorMessageMail.classList.toggle('active');
        userMailInput.classList.toggle('invalid');
      }
    });
    userMailInput.addEventListener('input', function () {
      const resetPasswordLink = document.querySelector('.reset__link') as HTMLElement;
      if (ErrorMessageMail.classList.contains('active')) {
        ErrorMessageMail.classList.toggle('active');
        userMailInput.classList.toggle('invalid');
      }
      if (userMailInput.classList.contains('invalid')) {
        userMailInput.classList.toggle('invalid');
      }
      if (resetPasswordMessage.classList.contains('active')) {
        resetPasswordLink.classList.remove('invisible');
        resetPasswordLink.classList.add('active');
        resetPasswordMessage.classList.toggle('active');
      }
    });
    userMailInput.addEventListener('blur', function () {
      if (!userMailInput.validity.valid) {
        ErrorMessageMail.classList.toggle('active');
        userMailInput.classList.toggle('invalid');
      }
    });

    const passwordLabel = createHtmlElement('label', 'label__item', 'Password:', this.userNamePasswordWrap);
    const passwordWrap = createHtmlElement('div', 'password__wrap', '', passwordLabel);
    const passwordInput = createHtmlElement('input', 'password', '', passwordWrap) as HTMLInputElement;
    this.resetPasswordLink = createHtmlElement('a', 'reset__link', 'Forgot your password?', this.userNamePasswordWrap);
    const resetPasswordMessage = createHtmlElement('div', 'reset__text', '', this.userNamePasswordWrap);
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('required', '');
    passwordInput.setAttribute('pattern', `[A-Za-zА-Яа-яЁё0-9-]{6,}`);
    const hidePasswordSvg = createHtmlElement('i', 'show__svg', '', passwordWrap);
    const ErrorMessagePassword = createHtmlElement('span', 'error__message', 'Invalid password', passwordLabel);

    passwordInput.addEventListener('invalid', function (e: Event) {
      e.preventDefault();
      if (!passwordInput.validity.valid) {
        ErrorMessagePassword.classList.toggle('active');
        passwordInput.classList.toggle('invalid');
      }
    });
    passwordInput.addEventListener('input', function () {
      if (ErrorMessagePassword.classList.contains('active')) {
        ErrorMessagePassword.classList.toggle('active');
        passwordInput.classList.toggle('invalid');
      }
    });

    hidePasswordSvg.addEventListener('click', (e: Event) => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      hidePasswordSvg.classList.toggle('hide__svg');
    });

    this.signInButton = createHtmlElement('button', 'sign__in', 'Sign in', form) as HTMLButtonElement;

    this.signUpButton = createHtmlElement('button', 'sign__up', 'Sign up', form) as HTMLButtonElement;

    this.submitButtonForSigIn = createHtmlElement('button', 'submit', 'Submit', form) as HTMLButtonElement;
    this.submitButtonForSigUp = createHtmlElement('button', 'submit', 'Submit', form) as HTMLButtonElement;

    this.signInButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.setSignInLayout();
    });

    this.signUpButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.setSignUpLayout();
    });

    this.submitButtonForSigIn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      signIn(userMailInput, passwordInput, ErrorMessageMail, ErrorMessagePassword);
    });

    this.submitButtonForSigUp.addEventListener('click', (e: Event) => {
      e.preventDefault();
      signUp(userMailInput.value, userNameInput.value, passwordInput.value, passwordInput, ErrorMessagePassword);
    });

    checkAuthStatus(form, buttonsWrap);

    continueBtn.addEventListener('click', () => this.emit('navigate', PATH.profilePage));

    changeUserBtn.addEventListener('click', () => {
      handleLogout();
    });

    this.resetPasswordLink.addEventListener('click', () => {
      resetPassword(userMailInput.value, userMailInput, resetPasswordMessage, this.resetPasswordLink);
    });
  }

  changeLang = (lang: Lang) => {
    console.log(lang);
  };

  render(): HTMLElement {
    const params = qs.parse(window.location.search).auth;
    if (params === 'sign_in') {
      this.setSignInLayout();
    }
    if (params === 'sign_up') {
      this.setSignUpLayout();
    }
    return this.mainWrapper;
  }

  setSignInLayout() {
    this.userNamePasswordWrap.classList.toggle('visible');
    this.signInButton.classList.toggle('invisible');
    this.signUpButton.classList.toggle('invisible');
    this.submitButtonForSigIn.classList.toggle('submit__visible');
    const params = qs.parse(window.location.search);
    params.auth = 'sign_in';
    const search = qs.stringify(params);
    window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
    this.resetPasswordLink.classList.toggle('active');
  }

  setSignUpLayout() {
    this.userNameLabel.classList.toggle('user__name-label-visible');
    this.userNamePasswordWrap.classList.toggle('visible');
    this.signInButton.classList.toggle('invisible');
    this.signUpButton.classList.toggle('invisible');
    this.submitButtonForSigUp.classList.toggle('submit__visible');
    const params = qs.parse(window.location.search);
    params.auth = 'sign_up';
    const search = qs.stringify(params);
    window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
  }
}