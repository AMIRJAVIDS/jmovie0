import { useNavigate } from "react-router-dom";
import CollectionHero from "./CollectionHero";


export default function FeaturedCollection({
  collection
}) {

  const navigate = useNavigate();


  if (!collection)
    return null;


  return (

    <CollectionHero

      collection={collection}

      featured={true}

      onClick={() =>
        navigate(`/collection/${collection.slug}`)
      }

    />

  );

}