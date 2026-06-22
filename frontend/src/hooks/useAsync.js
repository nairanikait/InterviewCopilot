import { useState, useRef, useCallback } from 'react';

/**
 * Generic async operation hook.
 * Tracks loading and error for any promise-returning fn.
 * `run` has a stable identity (via ref) so it is safe in useEffect deps.
 */
export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use a ref so the function identity never changes between renders
  const runRef = useRef(async (asyncFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  // Stable wrapper so consumers can destructure `run` safely
  const run = useCallback((...args) => runRef.current(...args), []);

  return { loading, error, run, setError };
}
