import createSagaMiddleware from 'redux-saga';
import { Middleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootSaga from './modules/rootSaga';
import rootReducer from './modules/rootReducer';

const removeLoadingProperties = createTransform(
  (inboundState: any) => {
    const newState: any = {};
    for (const objKey in inboundState) {
      if (!objKey.toUpperCase().includes('LOADING')) newState[objKey] = inboundState[objKey];
    }
    return { ...newState };
  },
  (outboundState) => ({ ...outboundState }),
);

const persistConfig = {
  key: 'root',
  storage,
  transforms: [removeLoadingProperties],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware];
const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
});
sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof rootReducer>;
export { store, persistor };
