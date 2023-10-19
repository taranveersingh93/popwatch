const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTNjY2EyZjFmM2E5MDRiNjM4OTMyYTU5YjgyNTgxMCIsInN1YiI6IjY1MmVlMTRmY2FlZjJkMDBhZGE4MmFhOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3vDx4WZfqhlVYcdHYQ4i1CHCGB9efXXhHwrrMNPNYDk";

const getMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular', {
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const getMovie = async (movieID) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const formatDate = date => {
    const inputDate = date.toString();
    const year = inputDate.slice(0,4);
    const month = inputDate.slice(5,7);
    const newDate = inputDate.slice(8);
    const months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December"
    };
    return `${months[month]} ${newDate}, ${year}`;
  }

  const formatCurrency = number => {
    console.log('number', number)
    const numString = number.toString();
    let startNum;
    let endNum;
    if (number > 1000000000) {
        startNum = numString.slice(0, numString.length - 9);
        endNum = "Billion";
    } else if (number > 1000000) {
        startNum = numString.slice(0, numString.length - 6);
        endNum = "Million";
    } else if (number > 1000) {
        startNum = numString.slice(0, numString.length - 3)
        endNum = "Thousand";
    } else {
        return "Figure unavailable";
    }
    return `$${startNum} ${endNum}`;
  }

  const formatRuntime = totalMins => {
    const hours = Math.floor(totalMins/60);
    const remainderMins = totalMins % 60;
    let hourText = "hour";
    let minText = "minute";
    if (hours > 1) {
        hourText = "hours"
    }
    if (remainderMins > 1) {
        minText = "minutes"
    }
    return `${hours} ${hourText} ${remainderMins} ${minText}`;
  }
  

const displayMovies = async () => {
    const data = await getMovies();
    const movieListDiv = document.getElementById('movieList');
    const moviePosterTemplate = document.getElementById('movieCardTemplate');
    const movies = data.results;
    // console.log('movie response', movies[0])

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const movieCard = moviePosterTemplate.content.cloneNode(true);
        const movieImg = movieCard.querySelector('.card-img-top');
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const movieTitle = movieCard.querySelector('.card-body > h5');
        movieTitle.innerText = movie.title;
        const movieParagraphElement = movieCard.querySelector('.card-text');
        movieParagraphElement.innerText = movie.overview;
        const movieBtn = movieCard.querySelector('.btn-primary');
        movieBtn.setAttribute("data-movieId", movie.id);
        movieListDiv.appendChild(movieCard);
    }
}

const generateGenres = (genres) => {
    let genresCode = '';
    const genresMap = {
        Action: "text-bg-warning",
        Thriller: "text-bg-success",
        Crime: "text-bg-danger",
        Drama: "text-bg-warning",
        Mystery: "text-bg-danger",
        Horror: "text-bg-danger",
        Adventure: "text-bg-info",
        "science fiction": "text-bg-light",
        Family: "text-bg-primary",
        Romance: "text-bg-primary",
        Fantasy: "text-bg-light",
        Comedy: "text-bg-warning"
    }
    
    for (let i = 0; i < genres.length; i++) {
        let className = "text-bg-dark";
        if (genresMap[genres[i].name]) {
            className = genresMap[genres[i].name];
        }
        const code = `<span class= "badge ${className} p-2 mx-1 fs-6">${genres[i].name}</span>`;
        genresCode += code; 
    }
    return genresCode;
}

const clearModal = () => {
    const modalBody = document.querySelector('#movieModal .modal-body');
    const modalTitle = document.querySelector('#movieModal .modal-title');
    const posterImg = modalBody.querySelector('.poster-img');
    const modalTagline = modalBody.querySelector('.modal-tagline');
    // const modalOverview = modalBody.querySelector('.modal-overview');
    const releaseDate = modalBody.querySelector('.release-date');
    const budget = modalBody.querySelector('.budget');
    const revenue = modalBody.querySelector('.revenue');
    const runtime = modalBody.querySelector('.runtime');
    const modalGenres = modalBody.querySelector('.genres');

    posterImg.src = "";
    modalTitle.innerText = "";
    modalBody.style.backgroundImage = `url("")`;
    modalTagline.innerText = "";
    // modalOverview.innerText = "";
    runtime.innerText = "";
    releaseDate.innerText = "";
    budget.innerText = "";
    revenue.innerText = "";
}

const showMovieDetails = async (clickedButton) => {
    clearModal();
    const movieID = clickedButton.getAttribute('data-movieId');
    const movieDetails = await getMovie(movieID);
    const modalBody = document.querySelector('#movieModal .modal-body');
    const modalTitle = document.querySelector('#movieModal .modal-title');
    const posterImg = modalBody.querySelector('.poster-img');
    const modalTagline = modalBody.querySelector('.modal-tagline');
    const releaseDate = modalBody.querySelector('.release-date');
    const budget = modalBody.querySelector('.budget');
    const revenue = modalBody.querySelector('.revenue');
    const runtime = modalBody.querySelector('.runtime');
    const ratings = modalBody.querySelector('.ratings');
    const modalGenres = modalBody.querySelector('.genres');
    const movieTitle = modalBody.querySelector('.movie-title');
    const synopsisHeading = modalBody.querySelector('.synopsis-heading');
    const synopsisText = modalBody.querySelector('.synopsis-text');
    const modalFooter = document.querySelector('.modal-footer');
    const imdbBtn = modalFooter.querySelector('.imdb-btn');
    const homepageBtn = modalFooter.querySelector('.homepage-btn')
    posterImg.src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
    modalTitle.innerText = movieDetails.title;
    movieTitle.innerText = movieDetails.title;
    modalBody.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8),rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path})`;
    modalTagline.innerText = `"${movieDetails.tagline}"`;
    const genres = movieDetails.genres;
    const genresHTML = generateGenres(genres);
    modalGenres.innerHTML = genresHTML;
    synopsisHeading.innerText = "Synopsis";
    synopsisText.innerText = movieDetails.overview;
    runtime.innerHTML = `<span class = "important-info">Runtime:</span> ${formatRuntime(movieDetails.runtime)} <i class="bi bi-clock"></i>`;
    releaseDate.innerHTML = `<span class = "important-info">Release Date:</span> ${formatDate(movieDetails.release_date)} <i class="bi bi-calendar-date"></i>`;
    budget.innerHTML = `<span class = "important-info">Budget:</span> ${formatCurrency(movieDetails.budget)} <i class="bi bi-coin"></i>`;
    revenue.innerHTML = `<span class = "important-info">Revenue:</span> ${formatCurrency(movieDetails.revenue)} <i class="bi bi-coin"></i>`;
    ratings.innerHTML = `<span class = "important-info">Ratings:</span> ${movieDetails.vote_average.toFixed(1)} <i class="bi bi-star-fill"></i>`;
    imdbBtn.setAttribute("href", `https://www.imdb.com/title/${movieDetails.imdb_id}/`);
    homepageBtn.setAttribute("href", movieDetails.homepage);
}