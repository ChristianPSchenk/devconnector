import { combineReducers } from "redux";
import alert from './alert';
import auth from "./auth";
import profile from "./profile";
import post from "./post";



export default combineReducers({
    // Add your reducers here
    // Example: auth: authReducer,
    // profile: profileReducer,
    // posts: postsReducer,
    alert,
    auth,
    profile,
    post

});

