// Helper functions to save and load state from localStorage
export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    if (typeof window !== "undefined") {
      localStorage.setItem("taskManagerState", serializedState)
    }
  } catch (err) {
    console.error("Could not save state", err)
  }
}

export const loadState = () => {
  try {
    if (typeof window !== "undefined") {
      const serializedState = localStorage.getItem("taskManagerState")
      if (serializedState === null) {
        return undefined
      }
      return JSON.parse(serializedState)
    }
    return undefined
  } catch (err) {
    console.error("Could not load state", err)
    return undefined
  }
}

