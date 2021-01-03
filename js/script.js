/*********** GET ELEMENTS ***********/
// FORM
const form = document.querySelector('form');
// BASIC INFO
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const jobRole = document.getElementById('title');
const otherJobRoleInput = document.getElementById('other-job-role');
// T-SHIRT INFO
const design = document.getElementById('design');
const color = document.getElementById('color');
const colorOptions = color.children;
// REGISTER FOR ACTIVITIES
const activities = document.getElementById('activities');
const activitiesBox = document.getElementById('activities-box');
const checkboxes = document.querySelectorAll('[type=checkbox]');
const total = document.getElementById('activities-cost');
let totalCost = 0;
// PAYMENT ELEMENTS
const cardInput = document.getElementById('cc-num');
const zipInput = document.getElementById('zip');
const cvvInput = document.getElementById('cvv');
const payment = document.getElementById('payment');
const creditCard = document.getElementById('credit-card');
const paypal = document.getElementById('paypal');
const bitcoin = document.getElementById('bitcoin');
const paymentMethod = payment.firstElementChild;
const paymentCreditCard = paymentMethod.nextElementSibling;

/*********** DEFAULTS WHEN PAGE LOADS ***********/
// Focus first form field when page loads
nameInput.focus();

// Hide 'other' input field when form first loads
otherJobRoleInput.style.display = 'none';

// Disable color selection by default
color.disabled = true;

// Set credit card to default payment selection
paymentCreditCard.setAttribute('selected', 'true');
// Hide other payment selections
paypal.style.display = 'none';
bitcoin.style.display = 'none';

/*********** EVENT LISTENERS ***********/
form.addEventListener('submit', submitForm);
activities.addEventListener('change', activitiesSelector);
activities.addEventListener('change', activitiesValidator);
activities.addEventListener('change', activitiesCost);
// T-SHIRT INFO
design.addEventListener('change', colorSelection);
// BASIC INFO
nameInput.addEventListener('keyup', nameValidator);
emailInput.addEventListener('keyup', emailValidator);
jobRole.addEventListener('change', jobSelection);
// FOR PAYMENT
payment.addEventListener('change', paymentSelection);
cardInput.addEventListener('keyup', cardValidator);
zipInput.addEventListener('keyup', zipValidator);
cvvInput.addEventListener('keyup', cvvValidator);

/*********** SUCCESS/ERROR STYLES ***********/
function validStyle(input) {
  const message = input.nextElementSibling;
  input.style.border = '2px solid #2ecc71';
  message.style.color = '#2ecc71';
  message.innerHTML = '&#10004; OK';
  message.style.display = 'block';
  input.parentElement.classList.remove('not-valid');
  input.parentElement.classList.add('valid');
  input.parentElement.style.color = '#2ecc71';
}

function errorStyle(input) {
  input.nextElementSibling.style.color = 'red';
  input.nextElementSibling.style.display = 'block';
  input.parentElement.style.color = 'red';
  input.parentElement.classList.remove('valid');
  input.parentElement.classList.add('not-valid');
  input.style.border = '';
}

/*********** HANDLER FUNCTIONS ***********/
// CHECKBOXES FOCUS HANDLER
// Add focus/remove focus class on activities boxes
function focusHandler() {
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('focus', e => {
      checkboxes[i].parentElement.classList.add('focus');
    });

    checkboxes[i].addEventListener('blur', e => {
      checkboxes[i].parentElement.classList.remove('focus');
    });
  }
}
focusHandler();

// JOB ROLE HANDLER
// Show/hide 'other' input based on job selection
function jobSelection(e) {
  if (e.target.value === 'other') {
    otherJobRoleInput.style.display = 'block';
  } else {
    otherJobRoleInput.style.display = 'none';
  }
}

// COLOR SELECTION HANDLER
function colorSelection(e) {
  // Enable 'color select' element
  const target = e.target.value;
  if (target) {
    color.disabled = false;
  }
  // Display shirt options based on design
  for (let i = 0; i < colorOptions.length; i++) {
    const theme = colorOptions[i].getAttribute('data-theme');
    // Show available shirt colors based on design selected
    if (target === theme) {
      colorOptions[i].hidden = false;
      colorOptions[i].selected = true;
    } else {
      colorOptions[i].hidden = true;
      colorOptions[i].selected = false;
    }
  }
}

// ACTIVITIES SELECTION HANDLER
function activitiesSelector(e) {
  const clicked = e.target;
  const clickedType = clicked.getAttribute('data-day-and-time');

  for (let i = 0; i < checkboxes.length; i++) {
    const checkboxType = checkboxes[i].getAttribute('data-day-and-time');
    // Enable/disable events that have conflicting times
    if (clickedType === checkboxType && clicked !== checkboxes[i]) {
      if (clicked.checked) {
        checkboxes[i].disabled = true;
        checkboxes[i].parentElement.classList.add('disabled');
      } else {
        checkboxes[i].disabled = false;
        checkboxes[i].parentElement.classList.remove('disabled');
      }
    }
  }
}

// ACTIVITIES COST HANDLER
function activitiesCost(e) {
  const checked = e.target.checked;
  // Convert value of cost attribute to a number
  const eventPick = +e.target.getAttribute('data-cost');

  if (checked) {
    totalCost += eventPick;
  } else {
    totalCost -= eventPick;
  }

  // Update total cost in UI
  total.innerHTML = `Total: $${totalCost}`;
}

// PAYMENT SELECTION HANDLER
function paymentSelection(e) {
  paymentChoice(e);
}

/********** HELPER FUNCTIONS **********/
// PAYMENT SELECTION
function paymentChoice(input) {
  const type = input.target.value;
  if (type === 'credit-card') {
    creditCard.style.display = 'block';
    bitcoin.style.display = 'none';
    paypal.style.display = 'none';
  } else if (type === 'paypal') {
    paypal.style.display = 'block';
    creditCard.style.display = 'none';
    bitcoin.style.display = 'none';
  } else {
    bitcoin.style.display = 'block';
    paypal.style.display = 'none';
    creditCard.style.display = 'none';
  }
}

// NAME VALIDATOR
function nameValidator() {
  const nameValue = nameInput.value;
  const nameIsValid = /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*?$/.test(nameValue);

  if (nameInput.name === 'user-name') {
    if (nameValue === '') {
      nameInput.nextElementSibling.innerHTML = 'Name field cannot be blank';
      errorStyle(nameInput);
    } else if (nameIsValid) {
      validStyle(nameInput);
    } else {
      nameInput.nextElementSibling.innerHTML =
        'Name field cannot contain numbers';
      errorStyle(nameInput);
    }
  }

  return nameIsValid;
}

// EMAIL VALIDATOR
function emailValidator() {
  const emailValue = emailInput.value;
  const emailIsValid = /^[^@]+@[^@.]+\.[a-z]+$/i.test(emailValue);

  if (emailInput.name === 'user-email') {
    if (emailValue === '') {
      emailInput.nextElementSibling.innerHTML = 'Email field cannot be blank';
      errorStyle(emailInput);
    } else if (emailIsValid) {
      validStyle(emailInput);
    } else {
      emailInput.nextElementSibling.innerHTML = `Email address must be formatted correctly
        example: name@name.com`;
      errorStyle(emailInput);
    }
  }

  return emailIsValid;
}

// CREDIT CARD VALIDATOR
function cardValidator() {
  const cardValue = cardInput.value;
  const cardIsValid = /^\d{13,16}$/.test(cardValue);

  if (cardInput.name === 'user-cc-num') {
    if (cardValue === '') {
      cardInput.nextElementSibling.innerHTML =
        'Credit card number must be between 13 - 16 digits';
      errorStyle(cardInput);
    } else if (cardIsValid) {
      validStyle(cardInput);
    } else {
      cardInput.nextElementSibling.innerHTML =
        'Credit card number must be between 13 - 16 digits';
      errorStyle(cardInput);
    }
  }
  return cardIsValid;
}

// ZIP CODE VALIDATOR
function zipValidator() {
  const zipValue = zipInput.value;
  const zipIsValid = /^[0-9]{5}$/.test(zipValue);

  if (zipInput.name === 'user-zip') {
    if (zipValue === '') {
      zipInput.nextElementSibling.innerHTML = 'Zip Code must be 5 digits';
      errorStyle(zipInput);
    } else if (zipIsValid) {
      validStyle(zipInput);
    } else {
      zipInput.nextElementSibling.innerHTML = 'Zip Code must be 5 digits';
      errorStyle(zipInput);
    }
  }

  return zipIsValid;
}

// CVV VALIDATOR
function cvvValidator() {
  const cvvValue = cvvInput.value;
  const cvvIsValid = /^\d{3}$/.test(cvvValue);

  if (cvvInput.name === 'user-cvv') {
    if (cvvValue === '') {
      cvvInput.nextElementSibling.innerHTML = 'CVV must be 3 digits';
      errorStyle(cvvInput);
    } else if (cvvIsValid) {
      validStyle(cvvInput);
    } else {
      cvvInput.nextElementSibling.innerHTML = 'CVV must be 3 digits';
      errorStyle(cvvInput);
    }
  }

  return cvvIsValid;
}

// ACTIVITIES VALIDATOR
function activitiesValidator() {
  let numChecked = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    let checked = checkbox.checked;
    if (checked) {
      numChecked++;
    }
  }

  if (numChecked > 0) {
    activities.classList.remove('not-valid');
    activities.classList.add('valid');
    activities.lastElementChild.style.display = 'none';
    return true;
  } else {
    activities.classList.remove('valid');
    activities.classList.add('not-valid');
    activities.lastElementChild.style.display = 'block';
    return false;
  }
}

// SUBMIT FORM HANDLER
function submitForm(e) {
  if (!nameValidator()) {
    e.preventDefault();
    console.log('Invalid Name');
  }

  if (!emailValidator()) {
    e.preventDefault();
    console.log('Make sure your email is correctly formatted');
  }

  if (creditCard.value === 'credit-card') {
    if (!cardValidator()) {
      e.preventDefault();
      console.log('Make sure credit card is 13-16 digits');
    }

    if (!zipValidator()) {
      e.preventDefault();
      console.log('Check the zip code and make sure it is 5 digits');
    }

    if (!cvvValidator()) {
      e.preventDefault();
      console.log('Check the CVV and make sure it is 3 digits');
    }
  }

  if (!activitiesValidator()) {
    e.preventDefault();
    console.log('Make sure you have selected at least 1 activity');
  }
}
