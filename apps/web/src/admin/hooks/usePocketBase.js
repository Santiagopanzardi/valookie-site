import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export function usePocketBase(collection, options = {}) {
  const {
    sort = '-created',
    filter = '',
    page = 1,
    perPage = 20,
    autoFetch = true,
    expand = '',
  } = options;

  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pb.collection(collection).getList(
        overrides.page || page,
        overrides.perPage || perPage,
        {
          sort: overrides.sort || sort,
          filter: overrides.filter !== undefined ? overrides.filter : filter,
          expand: overrides.expand || expand,
          $autoCancel: false,
        }
      );
      setData(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collection, sort, filter, page, perPage, expand]);

  const fetchAll = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    try {
      const items = await pb.collection(collection).getFullList({
        sort: overrides.sort || sort,
        filter: overrides.filter !== undefined ? overrides.filter : filter,
        expand: overrides.expand || expand,
        $autoCancel: false,
      });
      setData(items);
      setTotalItems(items.length);
      setTotalPages(1);
      return items;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collection, sort, filter, expand]);

  const create = useCallback(async (record) => {
    const created = await pb.collection(collection).create(record, { $autoCancel: false });
    return created;
  }, [collection]);

  const update = useCallback(async (id, record) => {
    const updated = await pb.collection(collection).update(id, record, { $autoCancel: false });
    return updated;
  }, [collection]);

  const remove = useCallback(async (id) => {
    await pb.collection(collection).delete(id);
  }, [collection]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return {
    data,
    totalItems,
    totalPages,
    loading,
    error,
    fetch,
    fetchAll,
    create,
    update,
    remove,
    setData,
  };
}
