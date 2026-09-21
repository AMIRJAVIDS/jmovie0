import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'


// import AuthPage from '../pages/AuthPage'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import EditProfilePage from '../pages/auth/EditProfilePage'

import NotFound from '../pages/NotFound'
import MainLayout from '../layout/MainLayout'

// movie
import MovieDetails from '../pages/movies/MovieDetails'
import MoviesPage from '../pages/movies/MoviesPage'

// series
import SeriesDetails from '../pages/series/SeriesDetails'
import SeriesPage from '../pages/series/SeriesPage'

// collections
import CollectionsPage from '../pages/collections/CollectionsPage'
import CollectionDetail from '../pages/collections/CollectionDetail'

// genres
import GenreDetailsPage from '../pages/GenreDetailsPage'

// support
import SupportPage from '../pages/SupportPage'
import PrizePage from '../pages/PrizePage'

// actor detail
import ActorDetailPage from '../pages/ActorDetailPage'

// admin
import AdminRoute from "../admin/routes/AdminRoute"
import AdminLayout from "../admin/layout/AdminLayout"
import Dashboard from "../admin/pages/Dashboard"
import Movies from "../admin/pages/Movies"
import MovieForm from '../admin/pages/MovieForm'
import Series from "../admin/pages/Series"
import SeriesForm from "../admin/pages/SeriesForm"
import Genres from "../admin/pages/Genres"
import GenreForm from "../admin/pages/GenreForm"
import Users from "../admin/pages/Users"
import UserForm from "../admin/pages/UserForm"
import NotAuthorized from "../admin/pages/NotAuthorized"
import { User } from 'lucide-react'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:slug" element={<MovieDetails />} />
        <Route path="/series/:slug" element={<SeriesDetails />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/faq" element={<SupportPage />} />
        <Route path="/profile" element={<EditProfilePage />} />
        <Route path="/person/:slug" element={<ActorDetailPage />} />
        <Route path="/genre/:slug" element={<GenreDetailsPage />} />
        <Route path="/pricing" element={<PrizePage />} />
        <Route path="/collection" element={<CollectionsPage />} />
        <Route path="/collection/:slug" element={<CollectionDetail />} />


        


        
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />

      

      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* movie */}
          <Route path="movies" element={<Movies />} />
          <Route path="movies/new" element={<MovieForm />} />
          <Route path="movies/:id/edit" element={<MovieForm />} />

          {/* series */}
          <Route path="series" element={<Series />} />
          <Route path="series/new" element={<SeriesForm />} />
          <Route path="series/:id/edit" element={<SeriesForm />} />

          {/* genres */}
          <Route path="genres" element={<Genres />} />
          <Route path="genres/new" element={<GenreForm />} />
          <Route path="genres/:id/edit" element={<GenreForm />} />

          {/* users */}
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id/edit" element={<UserForm />} />


          {/* <Route path="users" element={<Users />} /> */}
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
