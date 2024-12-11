import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slice/userSlice'
import providerReducer from '../slice/providerSlice'
import adminProvider from '../slice/adminSlice'

const store = configureStore({
    reducer:{
        user:userReducer,
        provider:providerReducer,
        admin:adminProvider
    }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
export default store