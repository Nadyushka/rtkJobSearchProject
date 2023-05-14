import {authApi, ResponseTypeAuth} from "1-DAL/authApi";
import {errorHandler} from "3-UI/u4-common/utilits/error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "3-UI/u4-common/utilits/create-app-async-thunk";

const initialState = {
    isAuthorised: false,
    isLoading: false,
    error: '',
    userAuthData: {
        "access_token": '',
        "refresh_token": '',
        "ttl": null,
        "expires_in": null,
        "token_type": '',
    } as userAuthDataType,
}

const authorisedWithPassword = createAppAsyncThunk<ResponseTypeAuth, AuthorisedWithPasswordArgsType>(
    "auth/authorisedWithPassword",
    async ({login, password, client_id, client_secret, hr}, {dispatch, rejectWithValue}) => {
        dispatch(authActions.isLoading({isLoading: true}))
        dispatch(authActions.setError({error: ''}))
        try {
            let res = await authApi.authorisedWithPassword({login, password, client_id, client_secret, hr})
            return res.data
        } catch (e) {
            errorHandler(e, dispatch, authActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(authActions.isLoading({isLoading: false}))
        }
    }
);

const refreshToken = createAppAsyncThunk<ResponseTypeAuth>(
    "auth/refreshToken",
    async (_, {dispatch, rejectWithValue, getState}) => {
        dispatch(authActions.isLoading({isLoading: true}))
        dispatch(authActions.setError({error: ''}))
        const refreshToken = getState().auth.userAuthData.refresh_token
        try {
            let res = await authApi.refreshToken(refreshToken)
            return res.data
        } catch (e) {
            errorHandler(e, dispatch, authActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(authActions.isLoading({isLoading: false}))
        }
    }
);

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        isLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
            state.isLoading = action.payload.isLoading
        },
        setError: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authorisedWithPassword.fulfilled, (state, action) => {
            state.userAuthData = action.payload;
            state.isAuthorised = true
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.userAuthData = action.payload;
        });
    },
})

export const authReducer = slice.reducer;
export const authThunks = {authorisedWithPassword, refreshToken};
export const authActions = slice.actions;

// types

export type AuthInitialStateType = typeof initialState
type AuthorisedWithPasswordArgsType = { login: string, password: string, client_id: number, client_secret: string, hr: number }
export type userAuthDataType = {
    "access_token": string,
    "refresh_token": string,
    "ttl": number | null,
    "expires_in": number | null,
    "token_type": string,
}
