// Variables
const form = document.getElementById('mortgage-form');
const amount = document.getElementById('amount');
const term = document.getElementById('term');
const rate = document.getElementById('rate');
const clearBtn = document.getElementById('clear-btn');
const output = document.getElementById('output');
const emptyState = document.getElementById('empty-state');
const monthlyText = document.getElementById('monthly');
const totalText = document.getElementById('total');

// Show an error message under input
function showError(input, message) {
  input.parentElement.classList.add('input-error');
  document.getElementById(`${input.id}-error`).textContent = message;
}

// Clear any error messages for input
function clearError(input) {
  input.parentElement.classList.remove('input-error');
  document.getElementById(`${input.id}-error`).textContent = '';
}

// Check if all fields are filled in
function validateInputs() {
  let isValid = true;
  const selectedType = document.querySelector('input[name="type"]:checked');

  if (!amount.value) { showError(amount, 'This field is required'); isValid = false; } else clearError(amount);
  if (!term.value) { showError(term, 'This field is required'); isValid = false; } else clearError(term);
  if (!rate.value) { showError(rate, 'This field is required'); isValid = false; } else clearError(rate);

  const typeError = document.getElementById('type-error');
  if (!selectedType) {
    typeError.textContent = 'This field is required';
    isValid = false;
  } else {
    typeError.textContent = '';
  }

  return isValid;
}

// Do the actual mortgage calculations
function calculateMortgage(principal, years, interestRate, type) {
  const monthlyRate = interestRate / 12;
  const totalPayments = years * 12;

  if (type === 'repayment') {
    const monthlyPayment = principal *
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    return [monthlyPayment, monthlyPayment * totalPayments];
  } else {
    const monthlyPayment = principal * monthlyRate;
    return [monthlyPayment, monthlyPayment * totalPayments];
  }
}

// Show results on the right side
function showResults(monthly, total) {
  monthlyText.textContent = `$${monthly.toFixed(2)}`;
  totalText.textContent = `$${total.toFixed(2)}`;
  emptyState.classList.add('hidden');
  output.classList.remove('hidden');
}

// Reset
function resetCalculator() {
  form.reset();
  [amount, term, rate].forEach(clearError);
  document.getElementById('type-error').textContent = '';
  emptyState.classList.remove('hidden');
  output.classList.add('hidden');
}

// Handle what happens when we hit calculate
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateInputs()) return;

  const principal = parseFloat(amount.value);
  const years = parseFloat(term.value);
  const interest = parseFloat(rate.value) / 100;
  const type = document.querySelector('input[name="type"]:checked').value;

  const [monthly, total] = calculateMortgage(principal, years, interest, type);
  showResults(monthly, total);
});

// Clear button just resets everything
clearBtn.addEventListener('click', resetCalculator);