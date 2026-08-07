import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import ProductoReducer from './productos/ProductoSlice';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    productos: ProductoReducer,
  },
});



export default store;
