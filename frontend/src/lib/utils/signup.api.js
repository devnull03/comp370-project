export const signup = async(username, email, password) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_ADDR}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, email, password}),
    });

    const data = await response.json();
    return {data, response}
}