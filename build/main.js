const API_KEY = "swK1ZwPxs8cuz4XuHXX7RG7zDFmZZa78YDWs0U0C";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const spanDate = document.getElementById("date");
const spanMaxTemp = document.getElementById("maxTemp");
const spanMinTemp = document.getElementById("minTemp");
const spanSol = document.getElementById("sol");
const spanWindDirectionCardinal = document.getElementById(
  "windDirectionCardinal"
);
const spanWindDirectionDegrees = document.getElementById(
  "windDirectionDegrees"
);
const spanWindSpeed = document.getElementById("windSpeed");

const previousDate = document.getElementById("previous-date");
const previousMaxTemp = document.getElementById("previous-maxTemp");
const previousMinTemp = document.getElementById("previous-minTemp");
const previousSol = document.getElementById("previous-sol");

const previousSolsTemplate = document.getElementById("previous-sols-template");
const previousSolsContainer = document.getElementById("previous-sols");

let selectedSolIndex;
getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];

  spanDate.innerHTML = formatDate(selectedSol.date);
  spanMaxTemp.innerHTML = formatTemperature(selectedSol.maxTemp);
  spanMinTemp.innerHTML = formatTemperature(selectedSol.minTemp);
  spanSol.innerHTML = selectedSol.sol;
  spanWindDirectionCardinal.innerHTML = selectedSol.windDirectionCardinal;
  spanWindDirectionDegrees.style.setProperty(
    "--direction",
    selectedSol.windDirectionDegrees + "deg"
  );
  spanWindSpeed.innerHTML = formatSpeed(selectedSol.windSpeed);
}

function displayPreviousSols(sols) {
  previousSolsContainer.innerHTML = "";
  console.log(previousSolsContainer);
  console.log(previousSolsTemplate);
  sols.forEach((solData, index) => {
    const solContainer = previousSolsTemplate.content.cloneNode(true);
    solContainer.getElementById("previous-date").innerHTML = formatDate(
      solData.date
    );
    solContainer.getElementById(
      "previous-maxTemp"
    ).innerHTML = formatTemperature(solData.maxTemp);
    solContainer.getElementById(
      "previous-minTemp"
    ).innerHTML = formatTemperature(solData.minTemp);
    solContainer.getElementById("previous-sol").innerHTML = solData.sol;
    solContainer
      .getElementById("previous-button")
      .addEventListener("click", () => {
        selectedSolIndex = index;
        displaySelectedSol(sols);
      });
    previousSolsContainer.appendChild(solContainer);
  });
}

function formatDate(date) {
  return date.toLocaleDateString("en-EN", { day: "numeric", month: "long" });
}

function formatTemperature(temperature) {
  return Math.round(temperature);
}

function formatSpeed(speed) {
  return Math.round(speed);
}

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
}

//
document.getElementById("open").addEventListener("click", function () {
  document.getElementById("bottom").classList.toggle("bottom-open");
  document
    .querySelector("#open span")
    .classList.toggle("previous__open-rotate");
});
