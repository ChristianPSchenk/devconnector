

import { REGISTER_SUCCESS, REGISTER_FAIL, AUTH_ERROR, LOGOUT, USER_LOADED, LOGIN_SUCCESS, LOGIN_FAIL, ACCOUNT_DELETED } from "../actions/types";

const initialState = {
    isAuthenticated: null,
    loading: true,
    user: null,
    token: localStorage.getItem('token')
}

const authreducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:

            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            };

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
        case ACCOUNT_DELETED:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false
            };
        default:
            return state;
    }
}

export default authreducer;