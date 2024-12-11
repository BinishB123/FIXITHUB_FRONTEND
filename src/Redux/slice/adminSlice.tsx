import { createSlice } from "@reduxjs/toolkit";
import { IAdminIntialState } from "../../interfaces/admin";
import { signInThunk, logoutThunk } from "../thunk/admin";


const adminData = JSON.parse(localStorage.getItem("isAdmin") || '{}');
const initialState: IAdminIntialState = {
    isLoading: false,
    isAdmin: adminData.isAdmin ? adminData.isAdmin : false,
    success: false,
    error: false,
    message: null,
    errorMessage: null
};


const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        resetAdminState: (state) => {
            state.isAdmin = false;
            state.error = false;
            state.errorMessage = null;
            state.success = false;
            state.message = null;
        },
        resetSuccess: (state) => {
            state.success = false;
            state.message = null;
        },
        resetError: (state) => {
            state.error = false;
            state.errorMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signInThunk.pending, (state) => {
            state.isLoading = true
        }).addCase(signInThunk.fulfilled, (state, action) => {
            state.isLoading = false
            if (action.payload.success) {

                state.isAdmin = action.payload.success
                state.success = action.payload.success
                state.message = "logged In"
            } else if (!action.payload.success) {
                state.error = true
                state.errorMessage = action.payload.message ? action.payload.message : null
            }
        }).addCase(signInThunk.rejected, (state) => {
            state.isLoading = false
            state.error = true
            state.errorMessage = "Something went wrong during sigin try again"
        }).addCase(logoutThunk.fulfilled, (state, action) => {
            localStorage.removeItem("isAdmin")
            state.isAdmin = false
            state.success = action.payload.success
            state.message = "Logout succes"
        }).addCase(logoutThunk.rejected, (state) => {
            state.error = true
            state.errorMessage = "An Error occured during logout"
        })
    }
});

export const { resetAdminState, resetError, resetSuccess } = adminSlice.actions;
export default adminSlice.reducer;
