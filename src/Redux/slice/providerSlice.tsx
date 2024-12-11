import { createSlice } from "@reduxjs/toolkit";
import { ProviderInitialState } from "../../interfaces/provider"
import { logoutthunk, providerRegisterThunk, signInThunk, } from "../thunk/provider";





const providerl = localStorage.getItem('provider');
const provider = providerl ? JSON.parse(providerl) : null;

const initialState: ProviderInitialState = {
    providerInfo: provider ? provider : null,
    success: null,
    isLoading: false,
    errorMessage: null,
    error: false,
    message: null
};

const providerSlice = createSlice({
    name: "provider",
    initialState,
    reducers: {
        reset: (state) => {
            state.providerInfo = null;
            state.isLoading = false;
            state.error = false;
        },
        resetMessage: (state) => {
            state.message = null;
        },
        resetSuccess: (state) => {
            state.success = null;
            state.message = null;
        },
        resetError: (state) => {
            state.error = false;
            state.errorMessage = null;
        },
        urgentReset: (state) => {
            state.providerInfo = null;
            state.message = null;
            state.success = false;
            state.error = false;
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(providerRegisterThunk.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(providerRegisterThunk.fulfilled, (state, action) => {
                state.message = action.payload.message + ", please wait while the admin reviews and approves your request.";
                state.success = true;
                state.isLoading = false;
            })
            .addCase(providerRegisterThunk.rejected, (state) => {
                state.errorMessage = 'Registration failed try again';
                state.error = true;
                state.isLoading = false;
            }).addCase(signInThunk.pending, (state) => {
                state.isLoading = true,
                    state.error = false
            }).addCase(signInThunk.fulfilled, (state, action) => {

                if (action.payload.success) {
                    state.providerInfo = action.payload.provider ? action.payload.provider : null;
                    state.success = action.payload.success
                    state.message = action.payload.message
                } else {
                    state.error = true,
                        state.errorMessage = action.payload.message
                }

                state.isLoading = false
            }).addCase(signInThunk.rejected, (state) => {
                state.error = true,
                    state.errorMessage = ""
            }).addCase(logoutthunk.pending, (state) => {
                state.isLoading = true
            }).addCase(logoutthunk.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.success = action.payload.success,
                        state.message = action.payload.message
                        state.providerInfo = null
                }
                if (!action.payload.success) {
                    state.error = action.payload.success
                    state.errorMessage = action.payload.message
                }

            });
    }
});

export const { reset, resetMessage, resetSuccess, resetError, urgentReset } = providerSlice.actions;
export default providerSlice.reducer;
