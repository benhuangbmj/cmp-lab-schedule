import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './reducers/userDataReducer.js'
import tasksReducer from './reducers/tasksReducer.js'

export default configureStore({
  reducer: {
    userData: userDataReducer,
    tasks: tasksReducer,
  }
});
