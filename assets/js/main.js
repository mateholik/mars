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

const unitToggle = document.getElementById("unit-toggle");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("fah");

let selectedSolIndex;
getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateUnits();

  unitToggle.addEventListener("click", () => {
    let metricUnits = !isMetric();
    metricRadio.checked = metricUnits;
    imperialRadio.checked = !metricUnits;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
  metricRadio.addEventListener("change", () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
  imperialRadio.addEventListener("change", () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
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
        if (window.innerWidth < 950) {
          toggleBottom();
        }
      });
    previousSolsContainer.appendChild(solContainer);
  });
}

function formatDate(date) {
  return date.toLocaleDateString("en-EN", { day: "numeric", month: "long" });
}

function formatTemperature(temperature) {
  let returnTemp = temperature;
  if (!isMetric()) {
    returnTemp = temperature * (9 / 5) + 32;
  }
  return Math.round(returnTemp);
}

function formatSpeed(speed) {
  let returnSpeed = speed;
  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }
  return Math.round(returnSpeed);
}

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log();
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT?.mx,
          minTemp: data.AT?.mn,
          windSpeed: data.HWS?.av,
          windDirectionDegrees: data.WD.most_common?.compass_degrees,
          windDirectionCardinal: data.WD.most_common?.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
}

function updateUnits() {
  const speedUnit = document.querySelectorAll("[data-speed-unit]");
  const tempUnit = document.querySelectorAll("[data-temp-unit]");
  speedUnit.forEach((unit) => {
    unit.innerHTML = isMetric() ? "kph" : "mph";
  });
  tempUnit.forEach((unit) => {
    unit.innerHTML = isMetric() ? "C" : "F";
  });
  updateTextNums();
}

function updateTextNums() {
  const textNums = document.querySelectorAll("[data-text-num]");
  const staticNums = [-60, -125, 20];
  textNums.forEach((num, i) => {
    let returnNum = num.innerHTML;
    if (!isMetric()) {
      returnNum = num.innerHTML * (9 / 5) + 32;
    } else {
      returnNum = staticNums[i];
    }
    num.innerHTML = Math.round(returnNum);
  });
}

function isMetric() {
  return metricRadio.checked;
}

function toggleBottom() {
  document.getElementById("bottom").classList.toggle("bottom-open");
  document
    .querySelector("#open span")
    .classList.toggle("previous__open-rotate");
  document.getElementById("previous-title").classList.toggle("hide");
}

document.getElementById("open").addEventListener("click", function () {
  toggleBottom();
});
document
  .getElementById("previous-title")
  .addEventListener("click", function () {
    toggleBottom();
  });

window.addEventListener("load", function (event) {
  const loader = document.getElementById("loader");
  fadeOut(loader);
});

function fadeOut(el) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}


console.log(1);