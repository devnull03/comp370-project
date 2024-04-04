export const logout = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_ADDR}/logout`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }, 
        credentials: 'include',
    });

    const data = await response.json();

    return {data, response};
}   