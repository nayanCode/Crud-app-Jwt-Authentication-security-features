import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading: false,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserAuth: (state, action) => {
            state.user=action.payload;
            state.loading=false;
            state.isAuthenticated=true;
        },
        clearUserAuth: (state, action) => {
            state.user=null;
            state.loading=false;
            state.isAuthenticated=false;
        },
        setAuthLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUserAuth, clearUserAuth,setAuthLoading} = authSlice.actions

export default authSlice.reducer