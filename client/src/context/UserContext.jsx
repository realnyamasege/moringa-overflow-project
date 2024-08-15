import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const server_url = "http://localhost:5000"; // Define your server URL here

export const UserProvider = ({ children }) => {
  const nav = useNavigate();

  const [currentUser, setCurrentUser] = useState();
  const [onChange, setOnChange] = useState(false);
  const [auth_token, setAuth_token] = useState(() => localStorage.getItem("access_token") || null);

  const register_user = (name, email, profile_image, phone_number, password) => {
    fetch(`${server_url}/users`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        email: email,
        profile_image: profile_image,
        password: password,
        phone_number: phone_number
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        toast.success(res.success);
        nav("/login");
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An error occurred");
      }
    })
    .catch(e => {
      console.log(e);
    });
  };

  const delete_user = () => {
    fetch(`${server_url}/users/${UserId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        "Authorization": `Bearer ${auth_token}`
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        toast.success(res.success);
        nav("/login");
        setCurrentUser(null);
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An error occurred");
      }
    });
  };

  const login_user = (email, password) => {
    fetch(`${server_url}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.access_token) {
        setAuth_token(res.access_token);
        localStorage.setItem("access_token", res.access_token);
        toast.success("Logged in Successfully!");
        nav("/dashboard");
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An error occurred");
      }
    });
  };

  const update_user = (name, phone_number, profile_image, password) => {
    fetch(`${server_url}/users`, {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        password: password,
        phone_number: phone_number,
        profile_image: profile_image,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        toast.success(res.success);
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An error occurred");
      }
    });
  };

  const logout = () => {
    fetch(`${server_url}/logout`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        localStorage.removeItem("access_token");
        setCurrentUser(null);
        setAuth_token(null);
        setOnChange(!onChange);
        nav("/login");
        toast.success(res.success);
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An error occurred");
      }
    });
  };

  useEffect(() => {
    if (auth_token) {
      fetch(`${server_url}/users`, {
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setCurrentUser(data);
        } else {
          localStorage.removeItem("access_token");
          setCurrentUser(null);
          setAuth_token(null);
          nav("/login");
        }
      });
    }
  }, [auth_token, onChange, nav]);

  const contextData = {
    auth_token,
    currentUser,
    setCurrentUser,
    register_user,
    login_user,
    update_user,
    logout,
    delete_user
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
