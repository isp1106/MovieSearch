let page = 1;
let initRequest = true;
let movies = [];
let totalResults = 0;
const inputSubmit = document.querySelector('input');
const btnSubmit = document.querySelector('.search-btn');
const movieList = document.querySelector('.movies');
const fetchMoreObserver = document.querySelector('.watch-more');
const infinityScroll = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      moreMovies();
    }
  });
});
infinityScroll.observe(fetchMoreObserver);

inputSubmit.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    searchMovies();
    window.scrollTo(0, 0);
    inputSubmit.blur();
  }
});
btnSubmit.addEventListener('click', () => {
  inputSubmit.blur();
  searchMovies();
});

function renderMovies(Search = []) {
  const movieEls = [];
  Search.forEach(movie => {
    const img = document.createElement('img'); 
    function setMoviePosterSource() {
      if ('N/A' !== movie.Poster) {
        return movie.Poster;
      } else {
        return 'https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png';
      }
    }
    img.src = setMoviePosterSource();
    img.setAttribute('alt', `${movie.Title} poster`);
    const title = document.createElement('h2');
    title.textContent = movie.Title;
    const yearEl = document.createElement('p');
    yearEl.textContent = movie.Year;
    const movieEl = document.createElement('li');
    const movieElLink = document.createElement('a');
    movieEl.classList.add('movies__item');
    title.classList.add('movies__item__title');
    yearEl.classList.add('movies__item__year');
    movieElLink.href = `https://www.google.com/search?q=${movie.Year}+${movie.Title}`;
    movieElLink.target = '_blank';
    movieElLink.title = `${movie.Title}`;
    movieEl.append(movieElLink)
    movieElLink.append(img, title, yearEl);
    movieEls.push(movieEl);
  });
  movieList.append(...movieEls);
}
async function getMovie(name) {
  let res = await fetch(`https://www.omdbapi.com?apikey=7035c60c&s=${name}&page=${page}`);
  res = await res.json();
  return res;
}

function makeLazyLoader(state) {
  loading = state;
  if (loading) {
    fetchMoreObserver.classList.add('loading');
  } else {
    fetchMoreObserver.classList.remove('loading');
  }
}

async function searchMovies() {
  makeLazyLoader(true);
  initRequest = true;
  movieList.innerHTML = '';
  page = 1;
  let { Search, totalResults: count } = await getMovie(inputSubmit.value);
  totalResults = Number(count)
  count = count || 0;
  const resultsEl = document.querySelector('.results');
  resultsEl.innerHTML = `<strong>${inputSubmit.value}</strong> 의 검색결과 <strong>${count}</strong>개 검색 되었습니다.`;
  movies = Search;
  renderMovies(Search);
  makeLazyLoader(false);
  initRequest = false;
}

async function moreMovies() {
  if (initRequest) return;
  if (movies.length >= totalResults) return;
  makeLazyLoader(true);
  page += 1;
  const { Search } = await getMovie(inputSubmit.value);
  movies.push(...Search);
  renderMovies(Search);
  makeLazyLoader(false);
}
