import { useEffect, useState } from "react";
import api from "../services/api";


export default function useCollectionDetail(slug) {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/collections/${slug}/`, {
          signal: controller.signal,
        });

        setCollection(response.data);
      } catch (err) {
        if (
          err.name !== "CanceledError" &&
          err.name !== "AbortError"
        ) {
          setError("خطا در دریافت اطلاعات کالکشن");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCollection();

    return () => {
      controller.abort();
    };
  }, [slug]);

  return {
    collection,
    loading,
    error,
  };
}
