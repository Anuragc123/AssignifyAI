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
    // console.log("useeffect authlayout");

    async function check() {
      try {
        const response = await axios.get(`${baseUrl}/user/checkAuth`, {
          withCredentials: true,
        });

        console.log("AuthLayout response:", response.data);

        if (response.data.success) {
          dispatch(login(response.data.user));
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login");
      } finally {
        setLoader(false);
      }
    }

    if (!isAuthenticated) {
      check();
    } else {
      setLoader(false);
    }
  }, [isAuthenticated]);

  console.log("isAuthenticated:", isAuthenticated);
  console.log("loader:", loader);
  if (loader) {
    return <h1>Loading...</h1>;
  }

  return <>{children}</>;
}

export default Protected;
