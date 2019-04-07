export const login = () => (
    {
        type: 'LOGIN',
    }
);

export const logout = () => (
    {
        type: 'LOGOUT',
    }
);

export const setUsername = username => (
    {
        type: 'SET_USERNAME',
        payload: username,
    }
);

export const setToken = token => (
    {
        type: 'SET_TOKEN',
        payload: token,
    }
);