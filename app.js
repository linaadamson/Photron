
const auth = config.API_KEY;
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelectorAll(".search-input");
const submitBtn = document.querySelectorAll(".submit-btn");
const form = document.querySelectorAll(".search-form");
const more = document.querySelector(".more");
const heroSearch = document.querySelector(".hero-search-form");
const navSearch = document.querySelector(".nav-search");
const explore = document.getElementById("explore");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

// EVENTLISTENER
searchInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    updateInput(e);
    submitBtn.forEach((btn) => {
      btn.classList.add("btn-active");
    });
  });
});

form.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
    explore.scrollIntoView(true);
    submitBtn.forEach((btn) => {
      btn.classList.remove("btn-active");
    });
  });
});

more.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <div class="gallery-cover">
    <div class="gallery-info">
    <p>${photo.photographer}</p>
    <a href=${photo.src.original} target = '_blank'>Download</a>
    </div>
    <img src=${photo.src.large}></img>
    <div class="gallery-cover">`;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();

// GSAP

// NAV SEARCH ANIMATION
gsap.to(".nav-search", {
  scrollTrigger: {
    trigger: ".hero-search-form",
    start: "center top",
    toggleActions: "play none none reverse",
  },
  opacity: 1,
  duration: 0.5,
});
