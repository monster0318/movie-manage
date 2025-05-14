import { create } from "zustand";

interface Movie {
  id: string;
  title: string;
  year: number;
  imgUrl: string;
}

interface MovieStore {
  movies: Movie[];
  fetchMovies: () => Promise<void>;
  addMovie: (movie: Omit<Movie, "id" | "userId">, userId: string) => Promise<void>;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => Promise<boolean>;
  deleteMovie: (id: string) => Promise<boolean>;
}


export const useMovieStore = create<MovieStore>((set) => ({
  movies: [],

  fetchMovies: async () => {
    const res = await fetch("/api/movies");
    const data = await res.json();
    set({ movies: data });
  },

  addMovie: async (movie, userId) => {
    const res = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...movie, userId }),
    });
  
    const data = await res.json(); // ✅ Await JSON response
  
    console.log("Response:", data); // ✅ Now correctly logs JSON data
  
    if (res.ok) {
      set((state) => ({ movies: [...state.movies, data] })); // ✅ Add new movie to Zustand store
    }
  },

  updateMovie: async (id, updatedMovie) => {
    const res = await fetch(`/api/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMovie),
    });
    if (res.ok) {
      set((state) => ({
        movies: state.movies.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m)),
      }));
      return true;
    }
    return false;
  },

  deleteMovie: async (id) => {
    const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
    if (res.ok) {
      set((state) => ({ movies: state.movies.filter((m) => m.id !== id) }));
    }
    return res.ok
  },
}));
