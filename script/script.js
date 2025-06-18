const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

const API_KEY = "60138cef01f506d45175ea0aec8596fc";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.innerHTML = "<p>Please enter a city.</p>";
    return;
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!weatherRes.ok) throw new Error("City not found");
    const currentData = await weatherRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!forecastRes.ok) throw new Error("Forecast data not found");
    const forecastData = await forecastRes.json();

    const now = new Date();
    const past24 = forecastData.list
      .filter((item) => new Date(item.dt_txt) < now)
      .slice(-8);
    const next24 = forecastData.list
      .filter((item) => new Date(item.dt_txt) > now)
      .slice(0, 8);

    const hourlyTemplate = (entries, label) => {
      return `
                <h3>${label}</h3>
                <div class="hourly">
                    ${entries
                      .map(
                        (entry) => `
                        <div class="hour-card">
                            <p><strong>${new Date(
                              entry.dt_txt
                            ).getHours()}:00</strong></p>
                            <p>${entry.weather[0].main}</p>
                            <p>${entry.main.temp}&deg;C</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
    };

    weatherResult.innerHTML = `
            <h2>${currentData.name}, ${currentData.sys.country}</h2>
            <div class="results">
                <p><i class="fa-solid fa-temperature-three-quarters"></i> Temperature: ${
                  currentData.main.temp
                }&deg;C</p>
                <p><i class="fa-solid fa-cloud"></i> Weather: ${
                  currentData.weather[0].main
                } - ${currentData.weather[0].description}</p>
                <p><i class="fa-solid fa-wind"></i> Wind Speed: ${
                  currentData.wind.speed
                } m/s</p>
                <p><i class="fa-solid fa-cloud-rain"></i> Humidity (as rain chance): ${
                  currentData.main.humidity
                }%</p>
                <button id="refreshBtn">Refresh</button>
            </div>
            ${hourlyTemplate(past24, "Past 24 Hours")}
            ${hourlyTemplate(next24, "Next 24 Hours")}
        `;

    document.getElementById("refreshBtn").addEventListener("click", () => {
      form.requestSubmit(); // This re-triggers the submit event with all existing listeners
    });
  } catch (error) {
    weatherResult.innerHTML = `<p>${error.message}</p>`;
  }
});
