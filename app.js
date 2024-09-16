document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.querySelector(".amount input");
  const fromCurrency = document.querySelector("#f-list");
  const toCurrency = document.querySelector("#t-list");
  const exchangeRateMsg = document.querySelector(".msg");
  const form = document.querySelector("form");
  const fromFlag = document.querySelector(".from img");
  const toFlag = document.querySelector(".to img");
  const swapButton = document.querySelector("#swap-button");
  const error = document.querySelector(".error");

  // Fetch and populate currency options
  fetch("https://open.er-api.com/v6/latest/USD")
    .then((response) => response.json())
    .then((data) => {
      const currencies = Object.keys(data.rates);
      populateCurrencyOptions(currencies);
    })
    .catch((error) => {
      console.error("Error fetching currency list:", error);
      alert("Failed to fetch currency list. Please try again later.");
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
      error.classList.remove("hidden");
      return;
    } else {
      error.classList.add("hidden");
    }

    getExchangeRate(from, to)
      .then((rate) => {
        const convertedAmount = (amount * rate).toFixed(2);
        exchangeRateMsg.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
      })
      .catch((error) => {
        console.error("Error fetching exchange rate:", error);
        alert("Failed to fetch exchange rate. Please try again later.");
      });
  });

  fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency.value, fromFlag);
  });

  toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency.value, toFlag);
  });

  swapButton.addEventListener("click", () => {
    swapCurrencies();
  });

  async function getExchangeRate(from, to) {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();
    return data.rates[to];
  }

  function populateCurrencyOptions(currencies) {
    currencies.forEach((currency) => {
      const optionFrom = document.createElement("option");
      optionFrom.value = currency;
      optionFrom.textContent = currency;
      fromCurrency.appendChild(optionFrom);

      const optionTo = document.createElement("option");
      optionTo.value = currency;
      optionTo.textContent = currency;
      toCurrency.appendChild(optionTo);
    });
  }

  function updateFlag(currency, flagElement) {
    const flagUrl = `https://flagsapi.com/${currency.slice(0, 2)}/flat/64.png`;
    flagElement.src = flagUrl;
  }

  function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlag(fromCurrency.value, fromFlag);
    updateFlag(toCurrency.value, toFlag);
  }
});
