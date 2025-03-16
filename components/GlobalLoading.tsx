"use client";

import { useAuth } from "../lib/contexts/AuthContext";
import Loading from "./Loading";

const GlobalLoading = () => {
  const { loading } = useAuth();

  return loading ? <Loading /> : null;
};

export default GlobalLoading;
