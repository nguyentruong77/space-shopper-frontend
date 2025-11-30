import { localStorageCache, sessionStorageCache } from "@/utils/cache";
import { delay } from "@/utils/delay";
import { useEffect, useRef, useState } from "react";

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
  limitDuration,
  onSuccess,
  onError,
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
      if (keepPreviousData && dataRef.current[cacheName]) {
        return dataRef.current[cacheName];
      }

      if (_asyncFunction[cacheName]) {
        return _asyncFunction[cacheName];
      }
      return cache.get(queryKey);
    }
  };

  const setCacheDataOrPreviousData = async (data) => {
    if (keepPreviousData) {
      dataRef.current[cacheName] = data;
    }
    if (cacheName && cacheTime) {
      let expired = cacheTime;
      if (cacheTime) {
        expired += Date.now();
      }

      cache.set(cacheName, data, expired);
    }
  };

  const fetchData = async (...args) => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    const startTime = Date.now();
    let res;
    let error;
    try {
      setLoading(true);
      setStatus("pending");
      res = getCacheDataOrPreviousData();
      if (!res) {
        res = queryFn({ signal: controllerRef.current.signal, params: args });
        if (cacheName) {
          _asyncFunction[cacheName] = res;
        }
      }

      if (res instanceof Promise) {
        res = await res;
        if (!res) return;
      }
    } catch (err) {
      console.log(err);
      error = err;
    }
    const endTime = Date.now();
    if (limitDuration) {
      let timeout = endTime - startTime;
      if (timeout < limitDuration) {
        await delay(limitDuration - timeout);
      }
    }

    if (cacheName) delete _asyncFunction[cacheName];

    if (res && !(res instanceof Promise)) {
      setCacheDataOrPreviousData(res);
      reFetchRef.current = false;
      onSuccess?.(res);
      setData(res);
      setLoading(false);
      setStatus("success");
      return res;
    }
    if (error) {
      onError?.(error);
      setError(error);
      setStatus("error");
      setLoading(false);
      throw error;
    }
  };
  const clearPreviousData = () => {
    dataRef.current = {};
  };
  return {
    data,
    error,
    status,
    loading,
    refetch: fetchData,
    clearPreviousData,
  };
};
