import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, AppStateType} from "2-BLL/store";

/**
 * add types to createAsyncThunk
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppStateType
    dispatch: AppDispatch
    rejectValue: unknown
}>()