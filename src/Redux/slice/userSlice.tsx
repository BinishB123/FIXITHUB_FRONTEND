import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import userInitialState, { SignInData, userResponse } from "../../interfaces/userInterface";
import { mainResponse } from "../../interfaces/userInterface";
import { Iusersignup } from "../../interfaces/userInterface";
import { logout, signin, signupAndverify, updateOrAddImageService, updateUserData } from "../../services/user/userService";






const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;


export const updateOrAddImage = createAsyncThunk<
    { success: boolean; url: string },
    { image: File; id: string; url?: string }
>(
    'user/updateOrAddLogo',
    async ({ image, id,url }) => {
        try {
            const response = await updateOrAddImageService(image, id, url);
            return { success: true, url: response.url };
        } catch (error) {
            console.error('Failed to update or add image:', error);
            throw error;
        }
    }
);

export const updateProfileDetail = createAsyncThunk<
    { success: boolean; newData: string; changed?: string },
    { newData: string; whichIstoChange: string; id: string }
>(
    'user/updateDetail',
    async ({ newData, whichIstoChange, id }, { rejectWithValue }) => {
        try {
            const response = await updateUserData(id, newData, whichIstoChange);

            return response;
        } catch (error) {

            return rejectWithValue(
                error instanceof Error ? error.message : 'An unknown error occurred'
            );
        }
    }
);



export const verfiyAndSignupThunk = createAsyncThunk<userResponse, { userData: Iusersignup; otp: string }>(
    'user/verify&signup',
    async ({ userData, otp }) => {
        try {
            const response = await signupAndverify(userData, otp);
            return response;
        } catch (error) {

            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
);

export const logoutthunk = createAsyncThunk<mainResponse>('user/logout', async () => {
    try {
        const response = await logout()
        return response
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
})

export const signInThunk = createAsyncThunk<userResponse, SignInData>('user/signin', async (signInData) => {
    try {
        const response = await signin(signInData)
        console.log(response);

        return response
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
})

const initialState: userInitialState = {
    userInfo: user ? user : null,
    success: null,
    isLoggedIn: user ? true : false,
    isLoading: false,
    errormessage: "",
    error: false,
    message: ''

};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
            state.isLoading = false;
            state.error = false;
            state.errormessage = ''
            state.message = ''
        },
        resetSuccessAndMessage: (state) => {
            state.message = ""
            state.success = null
        },
        resetErrorAndErrorMessage: (state) => {
            state.error = false
            state.errormessage = ""
        },
        urgentreset: (state) => {
            state.message = ""
            state.success = null
            state.error = false;
            state.errormessage = ""
        },



    },
    extraReducers: (builder) => {
        builder
            .addCase(verfiyAndSignupThunk.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(verfiyAndSignupThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = action.payload.message;
                state.success = action.payload.success;
                state.userInfo = action.payload.user ? action.payload.user : null
                state.isLoggedIn = true
                state.error = false;
            })
            .addCase(verfiyAndSignupThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = true;
                state.errormessage = action.payload as string
            }).addCase(logoutthunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = "Logout success"
                state.userInfo = null
            }).addCase(logoutthunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = true
                state.errormessage = action.payload as string
            }).addCase(signInThunk.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(signInThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.success = action.payload.success;
                    state.message = "signed In";
                    state.userInfo = action.payload.user ? action.payload.user : null
                }
                if (!action.payload.success) {
                    state.error = true
                    state.errormessage = action.payload.message
                }


            })
            .addCase(signInThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = true
                state.errormessage = action.payload as string;
            }).addCase(updateProfileDetail.fulfilled, (state, action) => {
                if (action.payload && state.userInfo && action.payload.changed) {
                    state.userInfo = {
                        ...state.userInfo,
                        [action.payload.changed]: action.payload.newData,
                    } as typeof state.userInfo;
                    localStorage.setItem("user", JSON.stringify(state.userInfo))
                    state.message = "Changed"
                    state.success = true
                }

            }).addCase(updateProfileDetail.rejected, (state) => {
                state.error = true
                state.errormessage = "Something went wrong try again"
            }).addCase(updateOrAddImage.fulfilled,(state, action) => {
                if (action.payload && state.userInfo ) {
                    state.userInfo = {
                        ...state.userInfo,
                        logoUrl: action.payload.url,
                    } as typeof state.userInfo;
                    localStorage.setItem("user", JSON.stringify(state.userInfo))
                    state.message = "Changed"
                    state.success = true
                }

            } )
    }

});


export const { reset, resetSuccessAndMessage, resetErrorAndErrorMessage, urgentreset } = userSlice.actions;
export default userSlice.reducer;
