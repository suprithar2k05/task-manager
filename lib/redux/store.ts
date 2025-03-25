import { configureStore, combineReducers } from "@reduxjs/toolkit"
import tasksReducer from "./features/tasksSlice"
import authReducer from "./features/authSlice"
import activityReducer from "./features/activitySlice"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { loadState, saveState } from "./localStorage"

// Create a root reducer
const rootReducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer,
  activity: activityReducer,
})

// Load state from localStorage
const preloadedState = loadState()

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
})

// Subscribe to store changes to save state to localStorage
store.subscribe(() => {
  saveState(store.getState())
})

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

