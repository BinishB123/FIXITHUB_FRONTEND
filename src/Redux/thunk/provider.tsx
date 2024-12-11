
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProviderModel, ProviderRegisterResponse, ProviderSignResponse, signInData ,mainResponse} from "../../interfaces/provider";
import { providerRegiterService, ProviderSign,logout } from "../../services/provider/providerService";


export const providerRegisterThunk = createAsyncThunk<
    ProviderRegisterResponse, // Response type
    { registerData: ProviderModel } // Argument type
>(
    'provider/registerprovider', // Action type
    async ({ registerData }, { rejectWithValue }) => {
        try {
            const response = await providerRegiterService(registerData);
            return response;
        } catch (error: any) {
            console.log(error);

            // Ensure you're passing a string message to rejectWithValue
            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('Something went wrong during provider registration.');
        }
    }
);

export const signInThunk = createAsyncThunk<
    ProviderSignResponse, // Response type
    { signin: signInData } // Argument type
>(
    'provider/signin', // Action type
    async ({ signin }, { rejectWithValue }) => {
        try {
            const response = await ProviderSign(signin);
            
            return response;
        } catch (error: any) {
          
            if (error.message) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Something went wrong during provider registration.');
        }
    }
);


export const logoutthunk = createAsyncThunk<mainResponse>('provider/logout', async () => {
    try {
        const response = await logout()
        return response
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
})
