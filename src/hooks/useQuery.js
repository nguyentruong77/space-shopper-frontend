import { localStorageCache, sessionStorageCache } from "@/utils/cache";
import { handleError } from "@/utils/handleError";
import { useRef, useEffect, useState } from "react";

const _cache = {
  localStorage: localStorageCache,
  sessionStorage: sessionStorageCache,
};

export const useQuery = ({
  queryFn,
  queryKey,
  dependencyList = [],
  enabled = true,
  cacheTime,
  storeDriver = "localStorage",
  keepPreviousData = false,
}) => {
  const dataRef = useRef({});
  const cacheName = Array.isArray(queryKey) ? queryKey[0] : queryKey;

  const cache = _cache[storeDriver];
  const reFetchRef = useRef();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [status, setStatus] = useState("idle");

  // useEffect(() => {
  //   if (typeof reFetchRef.current === "boolean") {
  //     reFetchRef.current = true;
  //   }
  // }, dependencyList);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled].concat(queryKey));

  const getCacheDataOrPreviousData = async () => {
    if (keepPreviousData && dataRef[cacheName]) {
      return dataRef[cacheName];
    }

    if (queryKey && !reFetchRef.current) {
      return cache.get(queryKey);
    }
  };

  const setCacheDataOrPreviousData = async (data) => {
    if (keepPreviousData) {
      dataRef[cacheName] = data;
    }
    if (cacheName) {
      let expired = cacheTime;
      if (cacheTime) {
        expired += Date.now();
      }

      cache.set(cacheName, data, expired);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setStatus("pending");
      let res = await getCacheDataOrPreviousData();
      if (!res) {
        res = await queryFn();
      }

      setStatus("success");
      setData(res);
      setLoading(false);

      setCacheDataOrPreviousData(res);
      reFetchRef.current = false;
    } catch (error) {
      setError(error);
      setStatus("error");
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    error,
    status,
    loading,
  };
};
