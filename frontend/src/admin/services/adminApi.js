import { data } from "react-router-dom"
import api from "../../services/api"

const getCount = (data) => {
  if (!data) return 0

  if (typeof data.count === "number") {
    return data.count
  }

  if (Array.isArray(data.results)) {
    return data.results.length
  }

  if (Array.isArray(data)) {
    return data.length
  }

  return 0
}

const getItems = (data) => {
  if (!data) return []

  if (Array.isArray(data.results)) {
    return data.results
  }

  if (Array.isArray(data)) {
    return data
  }

  return []
}

const getErrorMessage = (response) => {
  if (response.status !== "rejected") return null

  return (
    response.reason?.response?.data?.detail ||
    response.reason?.response?.data?.message ||
    response.reason?.message ||
    "خطا در دریافت اطلاعات"
  )
}

export const getAdminDashboardStats = async () => {
  const responses = await Promise.allSettled([
    api.get("/admin/movies/"),
    api.get("/admin/series/"),
    api.get("/admin/genres/"),
    api.get("/admin/users/"),
  ])

  const moviesResponse = responses[0]
  const seriesResponse = responses[1]
  const genresResponse = responses[2]
  const usersResponse = responses[3]

  const moviesData =
    moviesResponse.status === "fulfilled" ? moviesResponse.value.data : null

  const seriesData =
    seriesResponse.status === "fulfilled" ? seriesResponse.value.data : null

  const genresData =
    genresResponse.status === "fulfilled" ? genresResponse.value.data : null

  const usersData =
    usersResponse.status === "fulfilled" ? usersResponse.value.data : null

  return {
    stats: {
      moviesCount: getCount(moviesData),
      seriesCount: getCount(seriesData),
      genresCount: getCount(genresData),
      usersCount: getCount(usersData),
    },

    latestMovies: getItems(moviesData).slice(0, 5),
    latestSeries: getItems(seriesData).slice(0, 5),

    errors: {
      movies: moviesResponse.status === "rejected",
      series: seriesResponse.status === "rejected",
      genres: genresResponse.status === "rejected",
      users: usersResponse.status === "rejected",
    },

    errorMessages: {
      movies: getErrorMessage(moviesResponse),
      series: getErrorMessage(seriesResponse),
      genres: getErrorMessage(genresResponse),
      users: getErrorMessage(usersResponse),
    },
  }
}


// movies
export const getAdminMovies = async (params = {}) => {
  const response = await api.get("/admin/movies/", {
    params,
  })

  return response.data
}

export const getAdminMovieById = async (id) => {
  const response = await api.get(`/admin/movies/${id}/`)
  return response.data
}

export const createAdminMovie = async (data) => {
  const response = await api.post("/admin/movies/", data)
  return response.data
}

export const updateAdminMovie = async (id, data) => {
  const response = await api.patch(`/admin/movies/${id}/`, data)
  return response.data
}

export const deleteAdminMovie = async (id) => {
  const response = await api.delete(`/admin/movies/${id}/`)
  return response.data
}



// series
export const getAdminSeries = async (params = {}) => {
  const response = await api.get("/admin/series/", { params })
  return response.data
}

export const getAdminSeriesById = async (id) => {
  const response = await api.get(`/admin/series/${id}/`)
  return response.data
}

export const createAdminSeries = async (data) => {
  const response = await api.post("/admin/series/", data)
  return response.data
}

export const updateAdminSeries = async (id, data) => {
  const response = await api.patch(`/admin/series/${id}/`, data)
  return response.data
}

export const deleteAdminSeries = async (id) => {
  const response = await api.delete(`/admin/series/${id}/`)
  return response.data
}


// genres
export const getAdminGenres = async (params = {}) => {
  const response = await api.get("/admin/genres/", { params })
  return response.data
}

export const getAdminGenreById = async (id) => {
  const response = await api.get(`/admin/genres/${id}/`)
  return response.data
}

export const createAdminGenre = async (payload) => {
  const response = await api.post("/admin/genres/", payload)
  return response.data
}

export const updateAdminGenre = async (id, payload) => {
  const response = await api.patch(`/admin/genres/${id}/`, payload)
  return response.data
}

export const deleteAdminGenre = async (id) => {
  const response = await api.delete(`/admin/genres/${id}/`)
  return response.data
}



// users
export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users/", { params })
  return response.data
}

export const getAdminUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}/`)
  return response.data
}

export const createAdminUser = async (data) => {
  const response = await api.post("/admin/users/", data)
  return response.data
}

export const updateAdminUser = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/`, data)
  return response.data
}

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}/`)
  return response.data
}

