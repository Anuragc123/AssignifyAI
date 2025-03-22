import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { login } from "../store/authSlice";
import { baseUrl } from "../backend-url";

function Protected({ children }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  const isAuthenticated = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  useEffect(() => {

    async function check() {

      const response = await axios.get(`${baseUrl}/user/checkAuth`, {
        withCredentials: true, // Important for sending cookies
      });
      console.log(response);

      if (response.data.success) {

        dispatch(login(response.data.user));
      }
      else{
        navigate("/login");
      }
    }

    if (!isAuthenticated) {
      check();
    } 

    setLoader(false);
  }, [isAuthenticated]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}

export default Protected;
