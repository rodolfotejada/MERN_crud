import axios from 'axios';

const API_URL = '/api/users/';

// Register user;
const register = async (userData) => {
  const response = await axios.post(API_URL, userData); //api call

  if (response.data) {
    //axios puts the response in an obj named 'data'.
    localStorage.setItem('user', JSON.stringify(response.data)); //here we set the newly created 'user' to the localStorage.
  }

  return response.data;
};

// Login user:
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user:
const logout = () => {
  localStorage.removeItem('user');
};

//Exports:
const authService = {
  register,
  logout,
  login,
};

export default authService;
