import { useCallback, useEffect, useState } from "react";

export default function useAsync(asyncFn, dependencies = []) {
  const [data, setData] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, loading, refresh: run, setData };
}
