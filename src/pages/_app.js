import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "../slices/index";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import BaseLoading from "@/components/BaseLoading";
import { Analytics } from "@vercel/analytics/react";
const App = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (loading) {
    return <BaseLoading />;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
        <Analytics />
      </PersistGate>
    </Provider>
  );
};
export default App;
