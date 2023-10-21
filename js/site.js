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
        Swal.fire({
            backdrop: false,
            title: 'Oops',
            text: 'Something went wrong reaching the TMDB API.',
            icon: 'error'
        })
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
        Swal.fire({
            backdrop: false,
            title: 'Oops',
            text: 'Something went wrong reaching the TMDB API.',
            icon: 'error'
        })
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
    let hourText = "h";
    let minText = "m";
    return `${hours}${hourText} ${remainderMins}${minText}`;
  }
  

const displayMovies = async () => {
    const data = await getMovies();
    const movieListDiv = document.getElementById('movieList');
    const moviePosterTemplate = document.getElementById('movieCardTemplate');
    const movies = data.results;
    removeLoader(movies[0], "main");
    
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
    const modalBody = document.querySelector('#movieModal .modal-content');
    const html = `
    <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onclick="clearModal()"
        ></button>
    </div>
    <div class="modal-body">
        <div class="d-flex justify-content-center loader-div">
            <div class="spinner-border text-dark mt-5" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-lg-4 d-md-flex align-items-md-center">
                <img class="poster-img" src="" />
            </div>
            <div class="col-12 col-lg-8">
                <div>
                    <h2 class="movie-title mt-3"></h2>
                    <p class="modal-tagline m-0"></p>
                    <div class="genres py-3 border-bottom border-0 border-light border-opacity-25"></div>
                    <h3 class="synopsis-heading mt-3 mb-0"></h3>
                    <p class="synopsis-text py-3 border-bottom border-0 border-light border-opacity-25"></p>
                    <p class="runtime m-1"></p>
                    <p class="ratings m-1"></p>
                    <p class="release-date m-1"></p>
                    <p class="budget m-1"></p>
                    <p class="revenue m-1"></p>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer d-flex justify-content-evenly justify-content-md-end">
        <a href="#" type="button" target="_blank" class="btn btn-warning imdb-btn">View IMDB</a>
        <a href="#" type="button" target="_blank" class="btn btn-success homepage-btn">Movie Homepage</a>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>`;
    modalBody.innerHTML = html;
}

const removeLoader = (details, parentElement) => {
    let className;

    if (parentElement === "main") {
        className = "main-loader-div"
    } else {
        className = "loader-div";
    }

    if (details?.title) { 
        const loaderDiv = document.querySelector(`.${className}`);
        loaderDiv.innerHTML = '';
    }
}

const removeMainLoader = (details) => {
    if (details.title) {
        const loaderDiv = document.querySelector('.main-loader-div');
        loaderDiv.innerHTML = '';
    }
}

const showMovieDetails = async (clickedButton) => {
    const movieID = clickedButton.getAttribute('data-movieId');
    const movieDetails = await getMovie(movieID);
    removeLoader(movieDetails, "modal");
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
    modalTagline.innerText = movieDetails.tagline? `"${movieDetails.tagline}"`: "";
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