import { configureStore } from '@reduxjs/toolkit';
import { adminApi } from '../api/adminApi.js';
import { publicApi } from '../api/publicApi.js';

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [publicApi.reducerPath]:publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(adminApi.middleware)
  .concat(publicApi.middleware)
  ,
});