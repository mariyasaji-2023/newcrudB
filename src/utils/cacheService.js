export const CACHE_KEYS = {
    TOTAL_RESTAURANTS: 'totalRestaurants',
    TOTAL_DISHES: 'totalDishes',
  };
  
  // Helper to get cache timestamp key
  const getTimestampKey = (key) => `${key}_timestamp`;
  
  // Helper to check if cache is valid
  export const isCacheValid = (key, maxAge = 5 * 60 * 1000) => {
    const cachedTimestamp = localStorage.getItem(getTimestampKey(key));
    if (!cachedTimestamp) return false;
    
    const now = Date.now();
    return (now - parseInt(cachedTimestamp)) < maxAge;
  };
  
  // Get data from cache
  export const getFromCache = (key) => {
    try {
      const cachedData = localStorage.getItem(key);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error('Error retrieving from cache:', error);
      return null;
    }
  };
  
  // Set data in cache with timestamp
  export const setInCache = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(getTimestampKey(key), Date.now().toString());
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };
  
  // Invalidate specific cache entries
  export const invalidateCache = (keys) => {
    if (!keys || !Array.isArray(keys)) return;
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(getTimestampKey(key));
    });
  };
  
  // Invalidate all known caches
  export const invalidateAllCaches = () => {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(getTimestampKey(key));
    });
  };
  
  // Create a custom hook that uses this cache system
  export const useDataWithInvalidation = (key, fetchFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Check for cached data
      if (isCacheValid(key)) {
        const cachedData = getFromCache(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }
      
      // Otherwise fetch fresh data
      const fetchData = async () => {
        setLoading(true);
        try {
          const result = await fetchFunction();
          setData(result);
          setInCache(key, result);
          setError(null);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, [key, fetchFunction]);
  
    return { data, loading, error };
  };