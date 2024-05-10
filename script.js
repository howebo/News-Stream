//API Used: http://newsapi.org/s/india-news-api
const container = document.querySelector(".container");
const optionsContainer = document.querySelector(".options-container");
const searchInput = document.querySelector("#searchInput"); 
const searchButton = document.querySelector("#searchButton"); 
// "in" stands for India
const country = "in";
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

//100 requests per day
let requestURL;

//Create cards from data
const generateUI = (articles) => {
  for (let item of articles) {
    const formattedDate = new Date(`${item.publishedAt}`).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
    let card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `<div class="news-image-container">
    <img src="${item.urlToImage || "newspaper.jpg"}" alt="" />
    </div>
    <div class="news-content">
      <div class="news-title">
        ${item.title}
      </div>
      ${formattedDate}
      <div class="news-description">
      ${item.description || item.content || ""}
      </div>
      <a href="${item.url}" target="_blank" class="view-button">Read More</a>
    </div>`;
    container.appendChild(card);
  }
};

//News API Call
const getNews = async (URL) => {
  container.innerHTML = "";
  let response;
  if (URL) {
    response = await fetch(URL);
  } else {
    response = await fetch(requestURL);
  }
  if (!response.ok) {
    alert("Data unavailable at the moment. Please try again later");
    return false;
  }
  let data = await response.json();
  generateUI(data.articles);
};

//Category Selection
const selectCategory = (e, category) => {
  let options = document.querySelectorAll(".option");
  options.forEach((element) => {
    element.classList.remove("active");
  });
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
  e.target.classList.add("active");
  getNews();
};

// Search Functionality
const searchNews = () => {
  const topic = searchInput.value.trim();
  if (topic === "") {
    alert("Please enter a search term.");
    return;
  }
  const date = oneMonthBackDate();
  const searchURL = `https://newsapi.org/v2/everything?q=${topic}&from=${date}&sortBy=publishedAt&apiKey=${apiKey}`;
  getNews(searchURL);
};

//Options Buttons
const createOptions = () => {
  for (let i of options) {
    optionsContainer.innerHTML += `<button class="option ${
      i == "general" ? "active" : ""
    }" onclick="selectCategory(event,'${i}')">${i}</button>`;
  }
};

const init = () => {
  optionsContainer.innerHTML = "";
  getNews();
  createOptions();
  searchButton.addEventListener("click", searchNews);
};

const oneMonthBackDate = () => {
  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );

  const year = oneMonthAgo.getFullYear();
  const month = (oneMonthAgo.getMonth() + 1).toString().padStart(2, "0"); 
  const day = oneMonthAgo.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

window.onload = () => {
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${apiKey}`;
  init();
};
