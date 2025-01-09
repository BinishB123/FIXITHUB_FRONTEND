import { Response, SignData } from "../../interfaces/admin";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminSignIn, adminLogOut } from "../../services/admin/adminService";
export const signInThunk = createAsyncThunk<
    Response,
    { signin: SignData } 
>(
    'admin/signin',
    async ({ signin }, { rejectWithValue }) => {
        try {
            const response = await adminSignIn(signin);
           
            
            return response;
        } catch (error: any) {
            console.log(error);
            
            if (error.message) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Something went wrong during provider registration.');
        }
    }
);

export const logoutThunk = createAsyncThunk<Response>(
    'admin/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminLogOut();
            if (response.success) {
                return response;
            } else {

                return rejectWithValue(response.message || 'Logout failed');
            }
        } catch (error: any) {

            return rejectWithValue(error.message || 'An unknown error occurred');
        }
    }
);






