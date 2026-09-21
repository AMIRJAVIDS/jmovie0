import MediaPage from "../../components/pages/MediaPage";
import useMediaList from "../../hooks/useMediaList";
import mapMedia from "../../utils/mapMedia";


export default function MoviesPage() {
  const mediaState = useMediaList(
    "/movies/",
    mapMedia
  );

  return (
    <MediaPage
      title="فیلم‌ها"
      type="movie"
      {...mediaState}
    />
  );
}