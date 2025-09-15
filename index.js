// Elementos DOM
      const movieNameRef = document.getElementById("movie-name");
      const searchBtn = document.getElementById("search-btn");
      const result = document.getElementById("result");
      const featuredMoviesContainer = document.getElementById("featured-movies");
      const categoryCards = document.querySelectorAll('.category-card');
      const trailerModal = document.getElementById('trailer-modal');
      const closeModal = document.querySelector('.close-modal');
      const trailerContainer = document.getElementById('trailer-container');

      // Chave API (substitua pela sua chave real)
      const API_KEY = "7f9a3b82"; // Você manterá isso no key.js

      // Filmes populares para exibir em destaque
      const featuredMovies = [
        "The Dark Knight",
        "Pulp Fiction",
        "The Godfather",
        "Fight Club",
        "Inception",
        "Parasite",
        "Interstellar",
        "The Matrix"
      ];

      // Função para buscar filme
      const getMovie = (movieName = null) => {
        let searchTerm = movieName || movieNameRef.value;
        let url = `http://www.omdbapi.com/?t=${searchTerm}&apikey=${API_KEY}`;
        
        // Exibir loading
        result.innerHTML = `
          <div class="loading">
            <div class="loading-spinner"></div>
          </div>
        `;

        if (searchTerm.length <= 0) {
          result.innerHTML = `<h3 class="msg">Por favor, digite o nome de um filme</h3>`;
        } else {
          fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
              if (data.Response == "True") {
                result.innerHTML = `
                  <div class="fade-in">
                    <div class="movie-info">
                      <img src="${data.Poster}" alt="${data.Title}" class="movie-poster">
                      <div class="movie-details">
                        <h2 class="movie-title">${data.Title}</h2>
                        <div class="movie-rating">
                          <i class="fas fa-star"></i>
                          <span>${data.imdbRating} / 10</span>
                        </div>
                        <div class="movie-meta">
                          <span>${data.Rated}</span>
                          <span>${data.Year}</span>
                          <span>${data.Runtime}</span>
                        </div>
                        <div class="movie-genres">
                          ${data.Genre.split(",").map(genre => 
                            `<div class="genre-tag">${genre}</div>`
                          ).join("")}
                        </div>
                        <p class="movie-plot"><strong>Sinopse:</strong> ${data.Plot}</p>
                        <p class="movie-cast"><strong>Elenco:</strong> ${data.Actors}</p>
                        <p><strong>Diretor:</strong> ${data.Director}</p>
                        <p><strong>Prêmios:</strong> ${data.Awards}</p>
                        
                        <div class="movie-actions">
                          <button class="action-btn" onclick="searchTrailer('${data.Title} ${data.Year}')">
                            <i class="fab fa-youtube"></i> Ver Trailer
                          </button>
                          <button class="action-btn secondary" onclick="addToFavorites('${data.imdbID}')">
                            <i class="fas fa-heart"></i> Favoritar
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="section-title">Recomendações Similares</div>
                    <div class="movies-grid" id="recommendations">
                      <!-- As recomendações serão carregadas via JavaScript -->
                    </div>
                  </div>
                `;
                
                // Carregar recomendações baseadas no gênero
                loadRecommendations(data.Genre);
              } else {
                result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
              }
            })
            .catch(() => {
              result.innerHTML = `<h3 class="msg">Ocorreu um erro ao buscar o filme</h3>`;
            });
        }
      };

      // Função para carregar filmes em destaque
      const loadFeaturedMovies = () => {
        featuredMoviesContainer.innerHTML = '';
        
        featuredMovies.forEach(movie => {
          fetch(`http://www.omdbapi.com/?t=${movie}&apikey=${API_KEY}`)
            .then(resp => resp.json())
            .then(data => {
              if (data.Response == "True") {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                  <img src="${data.Poster}" alt="${data.Title}" class="movie-card-poster">
                  <div class="movie-card-content">
                    <h3 class="movie-card-title">${data.Title}</h3>
                    <div class="movie-card-meta">
                      <span>${data.Year}</span>
                      <div class="movie-card-rating">
                        <i class="fas fa-star"></i>
                        <span>${data.imdbRating}</span>
                      </div>
                    </div>
                  </div>
                `;
                movieCard.addEventListener('click', () => {
                  movieNameRef.value = data.Title;
                  getMovie(data.Title);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                featuredMoviesContainer.appendChild(movieCard);
              }
            });
        });
      };

      // Função para carregar recomendações
      const loadRecommendations = (genre) => {
        const firstGenre = genre.split(',')[0].trim();
        fetch(`http://www.omdbapi.com/?s=${firstGenre}&type=movie&apikey=${API_KEY}`)
          .then(resp => resp.json())
          .then(data => {
            if (data.Response == "True") {
              const recommendationsContainer = document.getElementById('recommendations');
              recommendationsContainer.innerHTML = '';
              
              // Limitar a 4 recomendações
              data.Search.slice(0, 4).forEach(movie => {
                fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
                  .then(resp => resp.json())
                  .then(movieData => {
                    if (movieData.Response == "True") {
                      const movieCard = document.createElement('div');
                      movieCard.className = 'movie-card';
                      movieCard.innerHTML = `
                        <img src="${movieData.Poster}" alt="${movieData.Title}" class="movie-card-poster">
                        <div class="movie-card-content">
                          <h3 class="movie-card-title">${movieData.Title}</h3>
                          <div class="movie-card-meta">
                            <span>${movieData.Year}</span>
                            <div class="movie-card-rating">
                              <i class="fas fa-star"></i>
                              <span>${movieData.imdbRating}</span>
                            </div>
                          </div>
                        </div>
                      `;
                      movieCard.addEventListener('click', () => {
                        movieNameRef.value = movieData.Title;
                        getMovie(movieData.Title);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      });
                      recommendationsContainer.appendChild(movieCard);
                    }
                  });
              });
            }
          });
      };

      // Função para buscar trailer no YouTube (simulação)
      const searchTrailer = (searchQuery) => {
        // Em uma implementação real, você usaria a API do YouTube
        // Esta é uma simulação simplificada
        trailerContainer.innerHTML = `
          <div style="padding:56.25% 0 0 0;position:relative;">
            <div style="color: #fff; text-align: center; padding: 2rem;">
              <i class="fab fa-youtube" style="font-size: 3rem; margin-bottom: 1rem;"></i>
              <p>Funcionalidade de trailer em desenvolvimento</p>
              <p>Em breve você poderá assistir trailers aqui!</p>
            </div>
          </div>
        `;
        trailerModal.style.display = 'flex';
      };

      // Função para adicionar aos favoritos
      const addToFavorites = (imdbID) => {
        // Simulação - em uma implementação real, você salvaria isso no localStorage
        alert('Filme adicionado aos favoritos!');
      };

      // Event Listeners
      searchBtn.addEventListener("click", () => getMovie());
      movieNameRef.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          getMovie();
        }
      });

      // Fechar modal
      closeModal.addEventListener('click', () => {
        trailerModal.style.display = 'none';
      });

      // Fechar modal clicando fora dele
      window.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
          trailerModal.style.display = 'none';
        }
      });

      // Adicionar eventos às categorias
      categoryCards.forEach(card => {
        card.addEventListener('click', () => {
          const genre = card.getAttribute('data-genre');
          movieNameRef.value = genre;
          getMovie(genre);
        });
      });

      // Buscar um filme popular ao carregar a página
      window.addEventListener("load", () => {
        movieNameRef.value = "The Godfather";
        getMovie("The Godfather");
        loadFeaturedMovies();
      });
   
    <script src="key.js"></script>