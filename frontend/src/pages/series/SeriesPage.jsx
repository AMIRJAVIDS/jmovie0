import MediaPage from "../../components/pages/MediaPage";
import useMediaList from "../../hooks/useMediaList";
import mapMedia from "../../utils/mapMedia";

export default function SeriesPage() {
  const mediaState = useMediaList(
    "/series/",
    mapMedia
  );

  return (
    <MediaPage
      title="سریال‌ها"
      type="series"
      {...mediaState}
    />
  );
}