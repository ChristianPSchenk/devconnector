import { applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';
const initialState = {};

const middleware = [thunk]

//const composeMiddleware = composeWithDevTools(
//    applyMiddleware(...middleware)
//)
const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: {
        name: 'DevConnectorApp',
        trace: true,
    }



});
export default store;