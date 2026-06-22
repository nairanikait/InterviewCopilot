import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

/**
 * useAnalytics – encapsulates all analytics data fetching.
 * Components receive { data, loading, error, refresh } only.
 * No business logic leaks into the UI layer.
 */
export function useAnalytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.getAnalytics();
      setData(result);
    } catch (err) {
      setError(err?.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refresh: fetch };
}
