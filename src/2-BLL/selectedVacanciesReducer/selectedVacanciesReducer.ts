import {SelectedVacancyInfo, VacancyInfo} from "1-DAL/vacanciesAPI";
import {errorHandler} from "3-UI/u2-assets/utilits/error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../3-UI/u2-assets/utilits/create-app-async-thunk";

const initialState = {
    isLoading: false,
    error: '',
    vacanciesData: {
        "objects": [] as SelectedVacancyInfo[],
        "total": 0,
        "corrected_keyword": '',
        "more": false
    },
    currentPage: 1,
    pageCount: 3,
}

const setSelectedVacanciesData = createAppAsyncThunk<ReturnedValue, SetSelectedVacanciesDataArgumentsType>(
    "selectedVacancies/setSelectedVacanciesData",
    async ({currentPage, count}, {dispatch, rejectWithValue}) => {
        dispatch(selectedVacanciesActions.isLoading({isLoading: true}))
        try {
            const localStorageSelectedVacancies = localStorage.getItem('selectedVacancies') ? localStorage.getItem('selectedVacancies') : '{selectedVacanciesArray:[]}'
            const selectedItems: VacancyInfo[] = JSON.parse(localStorageSelectedVacancies!).selectedVacanciesArray
            return {objects: selectedItems, currentPage, count}
        } catch (e) {
            errorHandler(e, dispatch, selectedVacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(selectedVacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const removeVacancyFromSelection = createAppAsyncThunk<ReturnedValue, RemoveVacancyFromSelectionArgumentsType>(
    "selectedVacancies/removeVacancyFromSelection",
    async ({id, currentPage, count}, {dispatch, rejectWithValue, getState}) => {
        dispatch(selectedVacanciesActions.isLoading({isLoading: true}))
        try {
            const selectedVacancies = getState().selectedVacancies.vacanciesData.objects.filter(v => v.id !== id)
            localStorage.removeItem('selectedVacancies')
            localStorage.setItem('selectedVacancies', JSON.stringify({selectedVacanciesArray: selectedVacancies}))
            return {objects: selectedVacancies, currentPage, count}
        } catch (e) {
            errorHandler(e, dispatch, selectedVacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(selectedVacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const addVacancyToSelected = createAppAsyncThunk<ReturnedValue,addVacancyToSelectedArgumentsType>(
    "selectedVacancies/addVacancyToSelected",
    async ({id, profession, payment_from, currency, type_of_work, town}, {
        dispatch,
        rejectWithValue,
        getState
    }) => {
        dispatch(selectedVacanciesActions.isLoading({isLoading: true}))
        try {
            const count = getState().selectedVacancies.pageCount
            const selectedVacanciesSaved = getState().selectedVacancies.vacanciesData.objects
            const newVacancy = {
                id,
                profession,
                currency,
                payment_from,
                type_of_work: {title: type_of_work},
                town: {title: town},
                marked: true
            }
            const selectedVacancies: SelectedVacancyInfo[] = [newVacancy, ...selectedVacanciesSaved]
            localStorage.removeItem('selectedVacancies')
            localStorage.setItem('selectedVacancies', JSON.stringify({selectedVacanciesArray: selectedVacancies}))
            return {objects: selectedVacancies, currentPage: 1, count}
        } catch (e) {
            errorHandler(e, dispatch, selectedVacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(selectedVacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const slice = createSlice({
    name: "selectedVacancies",
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
        builder.addCase(setSelectedVacanciesData.fulfilled, (state, action) => {
            state.vacanciesData.objects = action.payload.objects
            state.currentPage = action.payload.currentPage
            state.pageCount = action.payload.count
        });
        builder.addCase(removeVacancyFromSelection.fulfilled, (state, action) => {
            state.vacanciesData.objects = action.payload.objects
            state.currentPage = action.payload.currentPage
            state.pageCount = action.payload.count
        });
        builder.addCase(addVacancyToSelected.fulfilled, (state, action) => {
            state.vacanciesData.objects = action.payload.objects
            state.currentPage = action.payload.currentPage
            state.pageCount = action.payload.count
        });
    },
})

export const selectedVacanciesReducer = slice.reducer;
export const selectedVacanciesThunks = {setSelectedVacanciesData, removeVacancyFromSelection, addVacancyToSelected};
export const selectedVacanciesActions = slice.actions;

type ReturnedValue = { objects: SelectedVacancyInfo[], currentPage: number, count: number }

// types

export type SelectedVacanciesInitialStateType = typeof initialState
type SetSelectedVacanciesDataArgumentsType = { currentPage: number, count: number }
type RemoveVacancyFromSelectionArgumentsType = { id: number, currentPage: number, count: number }
type addVacancyToSelectedArgumentsType = { id: number, profession: string, payment_from: number | "", currency: "rub" | "uah" | "uzs", type_of_work: string, town: string }
