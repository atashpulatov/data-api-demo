import { waitAndClick } from '../utils/click-helper';

const OfficeLogin = function() {
  const usernameInput = '#i0116';
  const nextBtn = '#idSIButton9';
  const passwordInput = '#i0118';
 
  this.login = function(username, password) {
     $(usernameInput).setValue(username);
     waitAndClick($(nextBtn));
     browser.pause(1666);
     $(passwordInput).setValue(password);
     $(nextBtn).click();
     $(nextBtn).click();
  };
};

export default new OfficeLogin();
