const userData = {
  appartmentCost: 0,
  payment: 0,
  time: 0,
  interestRate: 0,
  data: [0, 0, 0, 0],

  updateValue: function () {
    this.appartmentCost = this.stringToNumber(view.costInput.value);
    this.payment = this.stringToNumber(view.paymentInput.value);
    this.time = Number(view.timeInput.value * 12);
    this.interestRate = Number(view.interestRateInput.value);
  },

  checkValidity: function (input) {
    input.value = input.value.replace (/\D/g, '');
  },

  getCredit: function () {
    const result = this.appartmentCost - this.payment;

    if (result < 0 || isNaN(result)) {
      return `рассчет...`;
    }

    return result;
  },

  getMonthlyPayment: function () {
    const x = this.interestRate / 1200;
    const result = Math.round(this.getCredit() * (x + (x / (Math.pow((1 + x), this.time) - 1))));

    if (isNaN(result)) {
      return `рассчет...`;
    }

    return result;
  },

  getIncome: function () {
    const result = Math.round(5 * (this.getMonthlyPayment() / 3));
    
    if (isNaN(result)) {
      return `рассчет...`;
    }

    return result;
  },

  getOverpayment: function () {
    const result = this.getMonthlyPayment() * this.time - this.appartmentCost + this.payment;

    if (result < 0 || isNaN(result)) {
      return `рассчет...`;
    }

    return result;
  },

  updatePayment: function () {
    const multipluer = document.querySelector(`.anchors__item--active`).value;
    document.querySelector(`#payment`).value = view.numberWithSpaces(Math.round(this.appartmentCost * multipluer / 100));
    this.updateValue();
    view.showResults();
  },

  updateAppartmentCost: function () {
    const multipluer = document.querySelector(`.anchors__item--active`).value;
    document.querySelector(`#cost`).value = view.numberWithSpaces(Math.round(this.payment * 100 / multipluer));
  },

  saveData: function () {
    this.data = [];
    this.data.push(view.costInput.value);
    this.data.push(view.paymentInput.value);
    this.data.push(view.timeInput.value);
    this.data.push(view.interestRateInput.value);
    localStorage.setItem('inputData', JSON.stringify(this.data));
  },

  stringToNumber: function (string) {
    let number = string.replace(/\s+/g, '');
    number = number * 1;
    return number;
  }
};

const view = {
  form: document.querySelector(`.form`),
  inputs: document.querySelectorAll(`input`),
  costInput: document.querySelector(`#cost`),
  paymentInput: document.querySelector(`#payment`),
  timeInput:document.querySelector(`#credit-time`) ,
  interestRateInput: document.querySelector(`#interest-rate`),
  creditAmount: document.querySelector(`.item__credit`),
  monthlyPayment: document.querySelector(`.item__monthly-payment`),
  income: document.querySelector(`.item__income`),
  overpayment: document.querySelector(`.item__overpayment`),
  anchors: document.querySelectorAll(`.anchors__item`),
  clearButton: document.querySelector(`.form__button--clear`),
  saveButton: document.querySelector(`.form__button--save`),

  showResults: function () {
    this.creditAmount.textContent = userData.getCredit().toLocaleString();
    this.monthlyPayment.textContent = userData.getMonthlyPayment().toLocaleString();
    this.income.textContent = userData.getIncome().toLocaleString();
    this.overpayment.textContent = userData.getOverpayment().toLocaleString();
  },

  anchorsOn: function (evt) {
    let activeAnchor = document.querySelector(`.anchors__item--active`);
    if (activeAnchor) {
      activeAnchor.classList.remove(`anchors__item--active`);
    }
    evt.target.classList.add(`anchors__item--active`);

    userData.updateValue();
    userData.updatePayment();
  },

  clearData: function () {
    this.form.reset();
  },

  loadData: function () {
    this.data = JSON.parse(localStorage.getItem('inputData'));
    this.costInput.value = this.data[0];
    this.paymentInput.value = this.data[1];
    this.timeInput.value = this.data[2];
    this.interestRateInput.value = this.data[3];
  },

  numberWithSpaces: function (value) {
    if (isNaN(Number(value))) {
      value = value.replace(/\s+/g, '');
      value = value * 1;
      return value.toLocaleString();
    }
    return Number(value).toLocaleString();
  }
};

view.saveButton.addEventListener('click', userData.saveData);

window.addEventListener('load', () => {
  view.loadData();
  userData.updateValue();
  userData.updatePayment();
  view.showResults();
});

for (let i = 0; i < view.inputs.length; i++) {
  view.inputs[i].addEventListener(`input`,() => {
    userData.checkValidity(view.inputs[i]);
    view.inputs[i].value = view.numberWithSpaces(view.inputs[i].value);
    userData.updateValue();
    view.showResults();
    if (view.inputs[i] === view.inputs[0]) {
      userData.updatePayment();
    }
    
    if (view.inputs[i] === view.inputs[1]) {
      userData.updateAppartmentCost();
    }
  });
}

for (let i = 0; i < view.anchors.length; i++) {
  view.anchors[i].addEventListener(`click`, view.anchorsOn);
}

view.clearButton.addEventListener(`click`, view.clearData);























