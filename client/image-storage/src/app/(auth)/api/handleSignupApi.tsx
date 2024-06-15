async function signUpUser(data: any) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  }
  
  export default signUpUser;