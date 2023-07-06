import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "@firebase/auth";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleButton from "@/components/GoogleButton";
import { clearUserDetail } from "@/slices/userSlice";
import { clearProjectsData } from "@/slices/projectsSlice";
import { clearProductsData } from "@/slices/productsSlice";
import { useDispatch } from "react-redux";
import { addUserDetail } from "@/slices/userSlice";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { selectUserState } from "@/slices/userSlice";
import { useSelector } from "react-redux";

const login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { authType } = router.query;
  const user_details = useSelector(selectUserState);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  const [authParams, setAuthParams] = useState({
    email: "",
    full_name: "",
    contact: "",
    company_address: "",
    type: "",
    role: "",
    company_name: "",
  });
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  useEffect(() => {
    if (Cookies.get("uid") && user_details?.user_id?.length > 0) {
      Router.push({
        pathname: "/dashboard",
      });
    } else {
      dispatch(clearUserDetail());
      dispatch(clearProjectsData());
      dispatch(clearProductsData());
    }
  }, []);

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    setLoadingGoogle(true);
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        toast("Could not complete signup!");
        setLoadingGoogle(false);
      } else {
        const user = res.user;
        axios
          .get(`../api/getUser?user_id=${user.uid}`)
          .then((resp) => {
            if (resp.data) {
              Cookies.set("access_token", user.accessToken, {
                expires: expires,
              });
              Cookies.set("uid", user.uid, {
                expires: expires,
              });
              dispatch(
                addUserDetail({
                  user_id: user.uid,
                  email: resp.data.email,
                  company_name: resp.data.company_name,
                  company_address: resp.data.company_address,
                  full_name: resp.data.full_name,
                  contact: resp.data.contact,
                  type: resp.data.type,
                  role: resp.data.role,
                  access: resp.data.access,
                })
              );
              Router.push({
                pathname: "/dashboard",
              });
            } else {
              if (authType === "login" || authType === undefined) {
                Router.push({
                  pathname: "/auth/authenticate",
                  query: { authType: "signup" },
                });
              } else {
                axios
                  .post(`../api/createUser`, {
                    full_name: authParams.full_name,
                    user_id: user.uid,
                    email: user.email,
                    contact: authParams.contact,
                    company_address: authParams.company_address,
                    company_name: authParams.company_name,
                    role: authParams.role,
                    type: authParams.type,
                  })
                  .then(() => {
                    Cookies.set("access_token", user.accessToken, {
                      expires: expires,
                    });
                    Cookies.set("uid", user.uid, {
                      expires: expires,
                    });
                    dispatch(
                      addUserDetail({
                        user_id: user.uid,
                        email: user.email,
                        company_name: authParams.company_name,
                        company_address: authParams.company_address,
                        full_name: authParams.full_name,
                        contact: authParams.contact,
                        type: authParams.type,
                        role: authParams.role,
                        access: "user",
                      })
                    );
                    Router.push({
                      pathname: "/dashboard",
                    });
                  })
                  .catch(() => {
                    toast(
                      authType === "login" || authType === undefined
                        ? "Something went wrong while signing in to your account"
                        : "Something went wrong while setting up your account"
                    );
                  });
              }
            }
          })
          .catch(() => {
            toast("Something went wrong while signing in to your account");
          })
          .finally(() => {
            setLoadingGoogle(false);
          });
      }
    } catch (err) {
      console.log(err);
      setLoadingGoogle(false);
      toast(
        "Oops! It seems like you've already signed up with a different account. Please try signing in with the same method you used during your initial registration",
        { autoClose: false }
      );
    }
  };

  return (
    <div className="h-screen lg:py-16 lg:px-32 md:py-14 md:px-10 bg-[url('/authmainbg.webp')] bg-no-repeat bg-cover ">
      <ToastContainer />
      <div className="h-full sm:grid-cols-1  grid md:grid-cols-2 shadow-2xl sm:rounded-none md:rounded-2xl  ">
        <div className=" md:block h-full sm:rounded-none md:rounded-l-2xl bg-[url('/authbg.webp')] bg-no-repeat bg-cover"></div>
        <div className="h-full sm:rounded-none md:rounded-r-2xl bg-[#f8f9fa] flex flex-col items-center md:justify-center pt-6 sm:pt-0  opacity-95">
          <Image
            src="/boho.webp"
            width={
              authType === "login" || authType === undefined ? "200" : "100"
            }
            height={
              authType === "login" || authType === undefined ? "200" : "100"
            }
            alt="Boho Logo"
          />
          <p
            className={`text-3xl font-medium text-[#01004e]-750 px-2 font-bold mt-3 text-center`}
            style={{ maxWidth: "400px" }}
          >
            {authType === "login" || authType === undefined
              ? "Login to your account"
              : "Create your account now"}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2 mb-4 text-center">
            {authType === "login" || authType === undefined
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <Link
              className="text-blue-900 cursor-pointer font-semibold"
              href={{
                pathname: "/auth/authenticate",
                query: {
                  authType:
                    authType === "login" || authType === undefined
                      ? "signup"
                      : "login",
                },
              }}
            >
              {authType === "login" || authType === undefined
                ? "Sign up"
                : "Log in"}
            </Link>
          </p>
          <form onSubmit={signInWithGoogle} className="flex flex-col">
            {authType === "signup" && (
              <TextField
                id="full_name"
                label="Full name"
                variant="outlined"
                type="text"
                required
                value={authParams.full_name}
                onChange={(e) =>
                  setAuthParams((authParams) => ({
                    ...authParams,
                    full_name: e.target.value,
                  }))
                }
                style={{ marginBottom: "10px" }}
                size="small"
              />
            )}
            {authType === "signup" && (
              <TextField
                id="contact"
                label="Contact"
                variant="outlined"
                type="tel"
                required
                value={authParams.contact}
                onChange={(e) =>
                  setAuthParams((authParams) => ({
                    ...authParams,
                    contact: e.target.value,
                  }))
                }
                pattern="[6-9]{1}[0-9]{9}"
                style={{ marginBottom: "10px" }}
                size="small"
              />
            )}

            {authType === "signup" && (
              <TextField
                id="type"
                select
                label="Type"
                required
                value={authParams.type}
                onChange={(e) =>
                  setAuthParams({ ...authParams, type: e.target.value })
                }
                style={{ marginBottom: "10px" }}
                size="small"
              >
                {["Architect", "Interior Designer", "Contractor", "Other"].map(
                  (type_value) => (
                    <MenuItem key={type_value} value={type_value}>
                      {type_value}
                    </MenuItem>
                  )
                )}
              </TextField>
            )}
            {authType === "signup" && (
              <TextField
                id="role"
                label="Role"
                variant="outlined"
                type="text"
                required
                value={authParams.role}
                onChange={(e) =>
                  setAuthParams((authParams) => ({
                    ...authParams,
                    role: e.target.value,
                  }))
                }
                style={{ marginBottom: "10px" }}
                size="small"
              />
            )}
            {authType === "signup" && (
              <TextField
                id="company_name"
                label="Company name"
                variant="outlined"
                type="text"
                required
                value={authParams.company_name}
                onChange={(e) =>
                  setAuthParams((authParams) => ({
                    ...authParams,
                    company_name: e.target.value,
                  }))
                }
                style={{ marginBottom: "10px" }}
                size="small"
              />
            )}
            {authType === "signup" && (
              <TextField
                id="company_address"
                label="Company address"
                variant="outlined"
                type="text"
                required
                value={authParams.company_address}
                onChange={(e) =>
                  setAuthParams((authParams) => ({
                    ...authParams,
                    company_address: e.target.value,
                  }))
                }
                style={{ marginBottom: "10px" }}
                size="small"
              />
            )}
            <button
              type="submit"
              className="text-white bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 font-bold rounded-sm text-md px-5 py-2.5 text-center inline-flex w-[300px] flex flex-row items-center justify-center"
              disabled={loadingGoogle}
            >
              <GoogleButton authType={authType} loadingGoogle={loadingGoogle} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default login;
