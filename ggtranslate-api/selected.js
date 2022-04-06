let selectInputLanguage = document.getElementById("selectInput");

window.addEventListener("load", () => {
  getData();
});

window.addEventListener("keyup", (e) => {
  //   alert(document.getSelection());
  detectedLanguage();
});

async function detectedLanguage() {
  const encodedParams = new URLSearchParams();
  encodedParams.append("text", `${document.getSelection()}`);
  encodedParams.append("tl", selectInputLanguage.value);

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
  alert(detect.data.translation);
}

async function getData() {
  const response = await fetch("./data/language.json");
  const responseData = await response.json();

  const listLanguages = responseData.languages;

  let option = "";
  for (const key in listLanguages) {
    if (key !== "auto") {
      option += `<option value="${key}">Tiếng ${listLanguages[key]}</option>`;
    }
  }

  selectInputLanguage.innerHTML = option;
}
