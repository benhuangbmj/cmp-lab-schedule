import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './reducers/userDataReducer.js'

export default configureStore({
  reducer: {
    userData: userDataReducer,
  }
})
