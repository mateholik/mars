const API_KEY = 'swK1ZwPxs8cuz4XuHXX7RG7zDFmZZa78YDWs0U0C'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

getWeather().then(sols => {
  console.log(sols);
})

function getWeather() {
  return fetch(API_URL).then(res => res.json()).then(data => {
    const { sol_keys, validity_checks, ...solData } = data
    return Object.entries(solData).map(([sol, data]) => {
      return {
        sol: sol,
        maxTemp: data.AT.mx,
        minTemp: data.AT.mn,
        windSpeed: data.HWS.av,
        windDirectionDegrees: data.WD.most_common.compass_degrees,
        windDirectionCardinal: data.WD.most_common.compass_point,
        date: new Date(data.First_UTC)
      }
    });
  })
}