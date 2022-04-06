/*
===============================================
                Get Elements
===============================================                
*/
let formTranslate = document.forms.formTranslate;
let selectInputLanguage = formTranslate.elements.selectInput;
let selectOuputLanguage = formTranslate.elements.selectOutput;
let inputText = document.getElementById("input-language");
let outputText = document.getElementById("output-language");
let selectedText = document.getElementById("text-selected");
const btnTranslate = document.querySelector(".btn-translate");
const btnChange = document.getElementById("btn-change");
const optionLanguage = document.getElementsByTagName("option");
const soundInput = document.getElementById("icon-input");
const soundOutput = document.getElementById("icon-output");

/*
===============================================
                Events
===============================================                
*/

window.addEventListener("load", function () {
  inputText.value = "";
  outputText.value = "";
  soundInput.classList.add("hidden");
  soundOutput.classList.add("hidden");
  getData();
});

btnTranslate.addEventListener("click", function (e) {
  e.preventDefault();
  // code translate
  translateMain();
});

inputText.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    translateMain();
  }
});

soundInput.addEventListener("click", function () {
  getVoice(inputText.value, selectInputLanguage.value);
});
soundOutput.addEventListener("click", function () {
  getVoice(outputText.value, selectOuputLanguage.value);
});

btnChange.addEventListener("click", function (e) {
  e.preventDefault();
  let [input, output] = [selectInputLanguage.value, selectOuputLanguage.value];
  selectInputLanguage.value = output;
  selectOuputLanguage.value = input;
});

/*
===============================================
                Functions
===============================================                
*/

function translateMain() {
  if (!inputText.value) {
    alert("Vui lòng nhập văn bản!!!");
  } else {
    // console.log(inputText);
    if (selectInputLanguage.value === "auto") {
      // console.log("Tự động phát hiện");
      detectedLanguage();
      // translate();
    } else {
      // console.log("Ngôn ngữ xác định");
      translate();
      soundInput.classList.add("show");
      soundOutput.classList.add("show");
    }
  }
}

async function translate() {
  const encodedParams = new URLSearchParams();
  encodedParams.append("text", `${inputText.value}`);
  encodedParams.append("tl", `${selectOuputLanguage.value}`);
  encodedParams.append("sl", `${selectInputLanguage.value}`);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Host": "google-translate20.p.rapidapi.com",
      "X-RapidAPI-Key": "7e31635c1dmsh6f42798f80de8afp1e8b40jsn2f68fe6071d0",
    },
    body: encodedParams,
  };

  const response = await fetch(
    "https://google-translate20.p.rapidapi.com/translate",
    options
  );
  const responseTranslate = await response.json();
  outputText.value = responseTranslate.data.translation;
}

async function getVoice(text, keyLanguage) {
  const response = await fetch("./data/sound.json");
  const soundLanguage = await response.json();
  var voices = soundLanguage.sounds;
  console.log(voices, text);
  var { voice } = voices.find((e) => e.id === keyLanguage);

  responsiveVoice.speak(text, voice);
}

// code.data.source.iso
async function detectedLanguage() {
  const encodedParams = new URLSearchParams();
  encodedParams.append("text", `${inputText.value}`);
  encodedParams.append("tl", `${selectOuputLanguage.value}`);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Host": "google-translate20.p.rapidapi.com",
      "X-RapidAPI-Key": "7e31635c1dmsh6f42798f80de8afp1e8b40jsn2f68fe6071d0",
    },
    body: encodedParams,
  };

  const response = await fetch(
    "https://google-translate20.p.rapidapi.com/translate",
    options
  );
  const detect = await response.json();
  let detectedLanguage = detect.data.source.language.iso;
  selectInputLanguage.value = detectedLanguage;
  console.log(detectedLanguage);
  outputText.value = detect.data.translation;
  soundInput.classList.add("show");
  soundOutput.classList.add("show");
}

async function getData() {
  const response = await fetch("./data/language.json");
  const responseData = await response.json();

  const listLanguages = responseData.languages;

  let option = "",
    option_2 = "";

  for (const key in listLanguages) {
    if (key === "auto") {
      option += `<option value="${key}">${listLanguages[key]}</option>`;
    } else {
      option += `<option value="${key}">Tiếng ${listLanguages[key]}</option>`;
      option_2 += `<option value="${key}">Tiếng ${listLanguages[key]}</option>`;
    }
  }
  selectInputLanguage.innerHTML = option;
  selectOuputLanguage.innerHTML = option_2;
}
