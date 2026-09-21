import api from "./api"; // همون اینستنس axios با اینترسپتورها

export async function fetchFilterOptions() {
  const { data } = await api.get("/movies/");
  return {
    years: data.years ?? [],
    countries: data.countries ?? [],
    actors: data.actors ?? [],
    directors: data.directors ?? [],
    genres: data.genres ?? [],
  };
}
