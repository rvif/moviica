import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieDetails extends Movie {
  backdrop_path: string | null;
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  vote_count?: number;
  production_companies?: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const AUTH_HEADER = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN}`,
};

const tmdb = {
  getTrendingMovies: async (): Promise<Movie[]> => {
    try {
      const res = await axios.get(`${BASE_URL}/trending/movie/week`, {
        headers: AUTH_HEADER,
      });
      return res.data.results;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      const res = await axios.get(`${BASE_URL}/search/movie`, {
        headers: AUTH_HEADER,
        params: { query },
      });
      return res.data.results;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  getMovieDetails: async (movieId: string): Promise<MovieDetails> => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        headers: AUTH_HEADER,
      });
      return res.data;
    } catch (error) {
      console.error(`Error fetching details for movie ID ${movieId}:`, error);
      throw error;
    }
  },

  getMovieCredits: async (movieId: string): Promise<MovieCredits> => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
        headers: AUTH_HEADER,
      });
      return res.data;
    } catch (error) {
      console.error(`Error fetching credits for movie ID ${movieId}:`, error);
      throw error;
    }
  },

  getMovieVideos: async (movieId: string): Promise<MovieVideo[]> => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        headers: AUTH_HEADER,
      });
      return res.data.results;
    } catch (error) {
      console.error(`Error fetching videos for movie ID ${movieId}:`, error);
      throw error;
    }
  },

  getSimilarMovies: async (movieId: string): Promise<Movie[]> => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
        headers: AUTH_HEADER,
      });
      return res.data.results;
    } catch (error) {
      console.error(
        `Error fetching similar movies for movie ID ${movieId}:`,
        error
      );
      throw error;
    }
  },
};

export default tmdb;
