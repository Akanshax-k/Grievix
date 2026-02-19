"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { hydrateUser } from "@/redux/slices/userSlice";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  useEffect(() => {
    store.dispatch(hydrateUser());
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
