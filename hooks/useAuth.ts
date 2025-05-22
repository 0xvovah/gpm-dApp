import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AUTH_BACKEND_GET_AUTH_TOKEN } from "@/lib/constants";
import { removeAuthData, getAuthData } from "@/lib/utils/localstorage";

const useAuth = (address?: string) => {
  const [authToken, setAuthToken] = useState();

  const authData = JSON.parse(getAuthData() || "{}");
  const cachedAuthToken = Number(authData?.token || 0);

  const fetchAuthToken = useCallback(async () => {
    if (!address) return;

    const res = await axios.get(`${AUTH_BACKEND_GET_AUTH_TOKEN}/${address}`);
    if (res.status == 200) {
      setAuthToken(res.data);

      if (cachedAuthToken !== res.data) {
        removeAuthData();
      }
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchAuthToken();
    }
  }, [address, fetchAuthToken]);

  return { authToken };
};

export default useAuth;
