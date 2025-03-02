import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import productListReducer from './productListSlice'

const store = configureStore({
  reducer: {
    products: productsReducer,
    productList:productListReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
