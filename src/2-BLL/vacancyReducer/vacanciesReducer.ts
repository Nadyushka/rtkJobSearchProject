import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ResponseTypeCatalogues,
    ResponseTypeVacancies,
    vacancyApi,
    VacancyInfo
} from "1-DAL/vacanciesAPI";
import {errorHandler} from "3-UI/u2-assets/utilits/error";
import {getDataFromLocalStorage} from "3-UI/u2-assets/utilits/localStorageData";
import {setPropertyMarkedToVacancies} from "3-UI/u2-assets/utilits/setPropertyMarkedToVacancies";
import {createAppAsyncThunk} from "3-UI/u2-assets/utilits/create-app-async-thunk";

const initialState = {
    isLoading: false,
    error: '',
    catalogueData: [] as ResponseTypeCatalogues[],
    vacanciesData: {
        "objects": [] as VacancyInfo[],
        "total": 0,
        "corrected_keyword": '',
        "more": false
    },
    vacancyData: {
        "id": 0,
        "payment_from": '',
        "payment_to": '',
        "profession": '',
        "currency": 'rub',
        "type_of_work": {
            "id": 0,
            "title": '',
        },
        "town": {
            "id": 0,
            "title": '',
            "declension": '',
            "genitive": '',
        },
        "firm_name": '',
        "vacancyRichText": '',
    } as VacancyInfo,
    currentPage: 1,
    pageCount: 3,
    payment_from: '' as number | '',
    payment_to: '' as number | '',
    jobArea: '',
    keyWord: '',
}

const setCatalogueData = createAppAsyncThunk<ResponseTypeCatalogues[]>(
    "vacancies/setCatalogueData",
    async (arg, {dispatch, rejectWithValue}) => {
        dispatch(vacanciesActions.isLoading({isLoading: true}))
        try {
            let res = await vacancyApi.getCatalogues()
            return res.data
        } catch (e) {
            errorHandler(e, dispatch, vacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(vacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const setVacanciesData = createAppAsyncThunk<ResponseTypeVacancies, setVacanciesDataArgsType>(
    "vacancies/setVacanciesData",
    async ({currentPage, count}, {dispatch, rejectWithValue, getState}) => {
        dispatch(vacanciesActions.isLoading({isLoading: true}))
        const token = getState().auth.userAuthData.access_token
        try {
            const res = await vacancyApi.getVacancies(token, {currentPage, count})
            const vacancies = setPropertyMarkedToVacancies(res.data)
            return vacancies
        } catch (e) {
            errorHandler(e, dispatch, vacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(vacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const setFiltredVacanciesData = createAppAsyncThunk<ResponseTypeVacancies, SetFiltredVacanciesDataArgsType>(
    "vacancies/setFiltredVacanciesData",
    async ({currentPage, count, published, keyWord, payment_from, payment_to, catalogues}, {
        dispatch,
        rejectWithValue,
        getState
    }) => {
        dispatch(vacanciesActions.isLoading({isLoading: true}))
        const token = getState().auth.userAuthData.access_token
        const catalogueID = getState().vacancies.catalogueData.find(c => c.title_rus === catalogues)!.key.toString()
        try {
            let res = await vacancyApi.getFiltredVacancies(token, {
                currentPage,
                count,
                published,
                keyword: keyWord,
                payment_from,
                payment_to,
                catalogues: catalogueID
            })
            dispatch(vacanciesActions.setFilters({keyWord, payment_from, payment_to, catalogues}))
            let vacancies = setPropertyMarkedToVacancies(res.data)
            return vacancies
        } catch (e) {
            errorHandler(e, dispatch, vacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(vacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const setVacancyData = createAppAsyncThunk<VacancyInfo, setVacancyDataArgsType>(
    "vacancies/setVacancyData",
    async ({id}, {dispatch, rejectWithValue, getState}) => {
        dispatch(vacanciesActions.isLoading({isLoading: true}))
        const token = getState().auth.userAuthData.access_token
        let selectedVacancies = getDataFromLocalStorage()
        try {
            let res = await vacancyApi.getVacancy(id, token)
            let vacancies = {...res.data, marked: selectedVacancies.includes(res.data.id)}
            return vacancies
        } catch (e) {
            errorHandler(e, dispatch, vacanciesActions.setError)
            return rejectWithValue(null)
        } finally {
            dispatch(vacanciesActions.isLoading({isLoading: false}))
        }
    }
);

const slice = createSlice({
    name: "vacancies",
    initialState,
    reducers: {
        isLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
            state.isLoading = action.payload.isLoading
        },
        setError: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error
        },
        setFilters: (state, action: PayloadAction<{ keyWord: string | '', payment_from: number | '', payment_to: number | '', catalogues: string | '' }>) => {
            state.keyWord = action.payload.keyWord
            state.payment_from = action.payload.payment_from
            state.payment_to = action.payload.payment_to
            state.jobArea = action.payload.catalogues
            state.currentPage = 1
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setCatalogueData.fulfilled, (state, action) => {
            state.catalogueData = action.payload
        });
        builder.addCase(setVacanciesData.fulfilled, (state, action) => {
            state.vacanciesData = action.payload;
        });
        builder.addCase(setFiltredVacanciesData.fulfilled, (state, action) => {
            state.vacanciesData = action.payload;
        });
        builder.addCase(setVacancyData.fulfilled, (state, action) => {
            state.vacancyData = action.payload;
        });
    },
})

export const vacanciesReducer = slice.reducer;
export const vacanciesThunks = {setCatalogueData, setVacanciesData, setFiltredVacanciesData, setVacancyData};
export const vacanciesActions = slice.actions;

// types

export type VacanciesInitialStateType = typeof initialState
type setVacanciesDataArgsType = { currentPage: number, count: number }
type SetFiltredVacanciesDataArgsType = { currentPage: number, count: number, published: number, keyWord: string | '', payment_from: number | '', payment_to: number | '', catalogues: string | '' }
type setVacancyDataArgsType = { id: number }