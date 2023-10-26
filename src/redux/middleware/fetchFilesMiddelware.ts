import { AnyAction, Middleware, ThunkDispatch } from '@reduxjs/toolkit';
import { fetchFiles, setBaseFolder } from '../features/recentFiles-slice';

export const fetchFilesMiddleware: Middleware<
  {},
  any,
  ThunkDispatch<any, any, AnyAction>
> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);

    if (action.type === setBaseFolder.type && action.payload) {
      dispatch(fetchFiles(action.payload));
    }
  };
