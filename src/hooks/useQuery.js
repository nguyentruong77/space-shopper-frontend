import { localStorageCache, sessionStorageCache } from "@/utils/cache";
import { handleError } from "@/utils/handleError";
import { useRef, useEffect, useState } from "react";

const _cache = {
  localStorage: localStorageCache,
  sessionStorage: sessionStorageCache,
};
const _asyncFunction = {};

export const useQuery = ({
  queryFn,
  queryKey,
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
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState();
  const [status, setStatus] = useState("idle");

  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled].concat(queryKey));

  const getCacheDataOrPreviousData = () => {
    if (cacheName) {
      if (keepPreviousData && dataRef[cacheName]) {
        return dataRef[cacheName];
      }

      if (_asyncFunction[cacheName]) {
        return _asyncFunction[cacheName];
      }
      return cache.get(queryKey);
    }
  };

  const setCacheDataOrPreviousData = async (data) => {
    if (keepPreviousData) {
      dataRef[cacheName] = data;
    }
    if (cacheName && cacheTime) {
      let expired = cacheTime;
      if (cacheTime) {
        expired += Date.now();
      }

      cache.set(cacheName, data, expired);
    }
  };

  const fetchData = async () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    try {
      setLoading(true);
      setStatus("pending");
      let res = getCacheDataOrPreviousData();
      if (!res) {
        res = queryFn({ signal: controllerRef.current.signal });
        if (cacheName) {
          _asyncFunction[cacheName] = res;
        }
      }

      if (res instanceof Promise) {
        res = await res;
        if (!res) return;
      }

      setStatus("success");
      setData(res);

      setCacheDataOrPreviousData(res);
      reFetchRef.current = false;
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setError(error);
      setStatus("error");
      handleError(error);
      setLoading(false);
    }
  };
  return {
    data,
    error,
    status,
    loading,
    refetch: fetchData,
  };
};
