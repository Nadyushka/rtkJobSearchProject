import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {AnyAction, combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {authReducer} from "./authReucer/authReducer";
import {vacanciesReducer} from "./vacancyReducer/vacanciesReducer";
import {selectedVacanciesReducer} from "./selectedVacanciesReducer/selectedVacanciesReducer";

// store
const rootReducer = combineReducers({
    auth: authReducer,
    vacancies: vacanciesReducer,
    selectedVacancies: selectedVacanciesReducer
})

export const store = configureStore({
    reducer: rootReducer,
})

//custom hooks
export const useAppDispatch = () => useDispatch<AppThunkDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// types
export type AppDispatch = typeof store.dispatch
export type AppStateType = ReturnType<typeof store.getState>
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AnyAction
>

//@ts-ignore
window.store = store