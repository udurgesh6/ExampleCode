import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { clearUserDetail } from "@/slices/userSlice";
import { clearProjectsData } from "@/slices/projectsSlice";
import { clearProductsData } from "@/slices/productsSlice";
import Logout from "../assets/images/logout.png";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { selectUserState } from "@/slices/userSlice";
import { useSelector } from "react-redux";
const Navbar = () => {
  const user_detail = useSelector(selectUserState);
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(true);
  const [largerScreen, setLargerScreen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setLargerScreen(false);
    }
  }, []);

  const router = useRouter();
  const path_name = router.pathname;
  const onLogout = () => {
    Cookies.remove("uid");
    Cookies.remove("access_token");
    dispatch(clearUserDetail());
    dispatch(clearProjectsData());
    dispatch(clearProductsData());
    Router.push({
      pathname: "/auth/authenticate",
      query: { authType: "login" },
    });
  };
  return (
    <>
      <nav
        style={{ height: "10%" }}
        className="bg-gray-700 border-gray-200 px-2 sm:px-4 py-2.5 w-[100%]"
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link href="/dashboard" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap ">
              {/* <span className="font-bold">BoHo</span> */}
              <Image
                src="/min_logo.gif"
                priority
                style={{ cursor: "pointer" }}
                width={70}
                height={30}
              />
            </span>
          </Link>
          <div className="flex md:order-2">
            <div className="relative hidden md:block">
              <Image
                src={Logout}
                priority
                onClick={onLogout}
                title="Logout"
                className="cursor-pointer"
              />
            </div>
            <button
              data-collapse-toggle="navbar-search"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 "
              aria-controls="navbar-search"
              aria-expanded={openMenu}
              onClick={() => setOpenMenu((openMenu) => !openMenu)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={
              largerScreen
                ? "items-center justify-between w-full md:flex md:w-auto md:order-1"
                : openMenu
                ? "hidden"
                : "items-center justify-between w-full md:flex md:w-auto md:order-1"
            }
            style={{ zIndex: "9" }}
            id="navbar-search"
          >
            <div className="relative mt-3 md:hidden"></div>
            <ul className="bg-gray-700 flex flex-col p-4 mt-3 rounded-b-lg  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 ">
              <li>
                <Link
                  href="/dashboard/"
                  className={`block py-2 ${
                    path_name === "/dashboard" ? "text-white" : "text-gray-300"
                  } rounded md:p-0 `}
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/my-projects"
                  className={`block py-2 ${
                    path_name === "/dashboard/my-projects"
                      ? "text-white"
                      : "text-gray-300"
                  } rounded md:p-0 `}
                >
                  My Projects
                </Link>
              </li>
              {user_detail.access === "admin" && (
                <li>
                  <Link
                    href="/dashboard/AddEditProduct"
                    className={`block py-2 ${
                      path_name === "/dashboard/AddEditProduct"
                        ? "text-white"
                        : "text-gray-300"
                    } rounded md:p-0 `}
                  >
                    Add/Edit Product
                  </Link>
                </li>
              )}
              {user_detail.access === "admin" && (
                <li>
                  <Link
                    href="/bulk-upload"
                    className={`block py-2 ${
                      path_name === "/bulk-upload"
                        ? "text-white"
                        : "text-gray-300"
                    } rounded md:p-0 `}
                  >
                    Bulk Upload
                  </Link>
                </li>
              )}
              {user_detail.access === "admin" && (
                <li>
                  <Link
                    href="/track-status"
                    className={`block py-2 ${
                      path_name === "/track-status"
                        ? "text-white"
                        : "text-gray-300"
                    } rounded md:p-0 `}
                  >
                    Track Status
                  </Link>
                </li>
              )}
              {user_detail.access === "admin" && (
                <li>
                  <Link
                    href="/access"
                    className={`block py-2 ${
                      path_name === "/access" ? "text-white" : "text-gray-300"
                    } rounded md:p-0 `}
                  >
                    Access
                  </Link>
                </li>
              )}
              {!largerScreen && (
                <li
                  onClick={onLogout}
                  className=" text-gray-300 py-2 rounded md:p-0  cursor-pointer"
                >
                  Logout
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
