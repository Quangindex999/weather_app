// // script.js
// const apiKey = "77622b522786a82a7f38b572774c2938"; // Thay bằng API key bạn lấy từ OpenWeather

// document.getElementById("get-weather").addEventListener("click", async () => {
//   const city = document.getElementById("city-input").value.trim();
//   if (!city) return alert("Vui lòng nhập tên thành phố");

//   try {
//     const res = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=vi`
//     );
//     if (!res.ok) throw new Error("Không tìm thấy thành phố");

//     const data = await res.json();

//     document.getElementById("city-name").textContent = data.name;
//     document.getElementById("temp").textContent = Math.round(data.main.temp);
//     document.getElementById("desc").textContent = data.weather[0].description;
//     document.getElementById("humidity").textContent = data.main.humidity;
//   } catch (err) {
//     alert(err.message);
//   }
// });
// script.js
const API_KEY = "77622b522786a82a7f38b572774c2938"; // Thay thế bằng API key của bạn
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather");
const weatherResult = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const humidity = document.getElementById("humidity");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

// Lấy lịch sử từ localStorage
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

// Hiển thị lịch sử khi trang được tải
function displayHistory() {
  historyList.innerHTML = "";
  searchHistory.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
            <span class="city">${item.city}</span>
            <span class="temp">${item.temp}°C</span>
        `;
    li.onclick = () => searchWeather(item.city);
    historyList.appendChild(li);
  });
}

// Lưu vào lịch sử
function saveToHistory(city, temp) {
  const newItem = { city, temp };
  searchHistory = [newItem, ...searchHistory.slice(0, 9)]; // Giữ tối đa 10 mục
  localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  displayHistory();
}

// Xóa lịch sử
clearHistoryBtn.addEventListener("click", () => {
  searchHistory = [];
  localStorage.removeItem("weatherHistory");
  displayHistory();
});

async function searchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`
    );
    const data = await response.json();

    if (data.cod === "404") {
      alert("Không tìm thấy thành phố!");
      return;
    }

    cityName.textContent = data.name;
    temp.textContent = Math.round(data.main.temp);
    desc.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;

    weatherResult.style.display = "block";
    saveToHistory(data.name, Math.round(data.main.temp));
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi tìm kiếm thời tiết!");
  }
}

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    searchWeather(city);
  } else {
    alert("Vui lòng nhập tên thành phố!");
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      searchWeather(city);
    }
  }
});

// Hiển thị lịch sử khi trang được tải
displayHistory();
