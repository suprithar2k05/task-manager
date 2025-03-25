import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

export interface Activity {
  id: string
  taskId: string
  action: string
  timestamp: string
  details?: string
}

interface ActivityState {
  activities: Activity[]
}

const initialState: ActivityState = {
  activities: [],
}

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, "id" | "timestamp">>) => {
      const newActivity: Activity = {
        id: uuidv4(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      }
      state.activities.push(newActivity)
    },
    clearActivities: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter((activity) => activity.taskId !== action.payload)
    },
  },
})

export const { addActivity, clearActivities } = activitySlice.actions

export default activitySlice.reducer

