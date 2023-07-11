function onBluringName(){
  let check = userinput.value;
  check = check.toLowerCase();
  check = check[0].toUpperCase() + check.slice(1);
  userinput.value = check;
  console.log(3232);
}


let userinput = document.querySelector("#username");
userinput.addEventListener("input", onBluringName);



function CustomValidation() {
	this.invalidities = [];
	this.validityChecks = [];
}

CustomValidation.prototype = {
	addInvalidity: function(message) {
		this.invalidities.push(message);
	},
	getInvalidities: function() {
		return this.invalidities.join('. \n');
	},
	checkValidity: function(input) {
		for ( var i = 0; i < this.validityChecks.length; i++ ) {

			var isInvalid = this.validityChecks[i].isInvalid(input);
			if (isInvalid) {
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			} 

			var requirementElement = this.validityChecks[i].element;
			if (requirementElement) {
				if (isInvalid) {
					requirementElement.classList.add('invalid');
					requirementElement.classList.remove('valid');
				} else {
					requirementElement.classList.remove('invalid');
					requirementElement.classList.add('valid');
				}

			} // end if requirementElement
		} // end for
	}
};




/* ----------------------------

	Validity Checks

	The arrays of validity checks for each input
	Comprised of three things
		1. isInvalid() - the function to determine if the input fulfills a particular requirement
		2. invalidityMessage - the error message to display if the field is invalid
		3. element - The element that states the requirement
	
---------------------------- */

var usernameValidityChecks = [
	{
		isInvalid: function(input) {
			return input.value.length < 3;
		},
		invalidityMessage: 'Длина должна составлять не мнее 3 символов',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input) {
			var illegalCharacters = input.value.match(/[^а-яА-Я]/g);
			return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Имя пользователя должен содержать буквы русского алфавита',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(2)')
	}
];

var passwordValidityChecks = [
	{
		isInvalid: function(input) {
			return input.value.length < 8 | input.value.length > 100;
		},
		invalidityMessage: 'Длина ввода должна быть от 8 до 100 символов',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[0-9]/g);
		},
		invalidityMessage: 'Требуется хотя бы 1 цифра',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(2)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[a-z]/g);
		},
		invalidityMessage: 'Требуется хотя бы 1 маленькая буква',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(3)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[A-Z]/g);
		},
		invalidityMessage: 'Требуется хотя бы 1 большая буква',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(4)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
		},
		invalidityMessage: 'Требуется спецсимвол',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(5)')
	}
];


var passwordRepeatValidityChecks = [
	{
		isInvalid: function() {
			return passwordRepeatInput.value != passwordInput.value;
		},
		invalidityMessage: 'Пароли не совпадают'
	}
];




/* ----------------------------

	Check this input

	Function to check this particular input
	If input is invalid, use setCustomValidity() to pass a message to be displayed

---------------------------- */

function checkInput(input) {

	input.CustomValidation.invalidities = [];
	input.CustomValidation.checkValidity(input);

	if ( input.CustomValidation.invalidities.length == 0 && input.value != '' ) {
		input.setCustomValidity('');
	} else {
		var message = input.CustomValidation.getInvalidities();
		input.setCustomValidity(message);
	}
}



/* ----------------------------

	Setup CustomValidation

	Setup the CustomValidation prototype for each input
	Also sets which array of validity checks to use for that input

---------------------------- */
var usernameInput = document.getElementById('username');
var passwordInput = document.getElementById('password');
var passwordRepeatInput = document.getElementById('password_repeat');
usernameInput.CustomValidation = new CustomValidation();
usernameInput.CustomValidation.validityChecks = usernameValidityChecks;

passwordInput.CustomValidation = new CustomValidation();
passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

passwordRepeatInput.CustomValidation = new CustomValidation();
passwordRepeatInput.CustomValidation.validityChecks = passwordRepeatValidityChecks;




/* ----------------------------

	Event Listeners

---------------------------- */

var inputs = document.querySelectorAll('input:not([type="submit"])');
var submit = document.querySelector('input[type="submit"');

for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('keyup', function() {
		checkInput(this);
	});
}

submit.addEventListener('click', function() {
	for (var i = 0; i < inputs.length; i++) {
		checkInput(inputs[i]);
	}
});

/* Обработчик кнопки с перенаправлением на регистрацию */
var redirect_url = ""

document.getElementById('regBtn').onclick = function() {
  window.location.href = 'https://lab4-1.snaketeeth.repl.co/register';
};