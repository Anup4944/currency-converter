const getCurrOption = async () => {
  const response = await fetch("https://api.exchangerate.host/symbols");

  const jsonDt = await response.json();

  return jsonDt.symbols;
};

const getCurrRate = async (old, newRt) => {
  const convertUrl = new URL("https://api.exchangerate.host/convert");

  convertUrl.searchParams.append("from", old);
  convertUrl.searchParams.append("to", newRt);

  const response = await fetch(convertUrl);
  const json = await response.json();
  return json.result;
};

const showOptions = (selectElement, optionItem) => {
  const optionElement = document.createElement("option");
  optionElement.value = optionItem.code;
  optionElement.textContent = optionItem.description;

  selectElement.appendChild(optionElement);
};

const populateSelect = (selectElement, optionList) => {
  optionList.forEach((optionItem) => {
    showOptions(selectElement, optionItem);
  });
};

const setUpCurr = async () => {
  const fromCurrEle = document.getElementById("input");
  const toCurrEle = document.getElementById("output");

  const currOption = await getCurrOption();

  const currencies = Object.keys(currOption).map(
    (currKeys) => currOption[currKeys]
  );

  populateSelect(fromCurrEle, currencies);
  populateSelect(toCurrEle, currencies);
};

const setEventListener = async () => {
  const formDt = document.getElementById("convertForm");

  formDt.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fromCurr = document.getElementById("input");
    const toCurr = document.getElementById("output");

    const amount = document.getElementById("amount");

    const convResult = document.getElementById("result");

    try {
      const rate = await getCurrRate(fromCurr.value, toCurr.value);

      const amountValue = Number(amount.value);

      const covertedResult = Number(amountValue * rate).toFixed(2);

      convResult.textContent = `${amountValue} ${fromCurr.value}  = ${covertedResult} ${toCurr.value}`;
    } catch (error) {
      convResult.textContent = `There was an error getting the convertion rate ${error.message} `;

      convResult.classList.add("error");
    }
  });
};

setUpCurr();
setEventListener();
