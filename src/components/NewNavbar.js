import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { selectUserState } from "@/slices/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUserDetail } from "@/slices/userSlice";
import { clearProjectsData } from "@/slices/projectsSlice";
import { clearProductsData } from "@/slices/productsSlice";
import Cookies from "js-cookie";
import ProductSearchBar from "./ProductSearchBar";
const NewNavbar = ({
  searchProductsByTags,
  clearFilter,
  searchTags,
  setSearchTags,
  searchProductsByTagId,
}) => {
  const user_detail = useSelector(selectUserState);
  const isAdmin = user_detail.access === "admin";
  const dispatch = useDispatch();
  const router = useRouter();
  const path_name = router.pathname;
  const allRoutes = [
    { route_name: "Home", route_url: "/dashboard", route_type: "general" },
    {
      route_name: "My Projects",
      route_url: "/dashboard/my-projects",
      route_type: "general",
    },
    {
      route_name: "Add/Edit Product",
      route_url: "/dashboard/AddEditProduct",
      route_type: "admin",
    },
    {
      route_name: "Bulk Upload",
      route_url: "/bulk-upload",
      route_type: "admin",
    },
    { route_name: "Access", route_url: "/access", route_type: "admin" },
    {
      route_name: "Track Status",
      route_url: "/track-status",
      route_type: "admin",
    },
  ];
  const current_route_name = allRoutes.filter(
    (current_route) => current_route.route_url === path_name
  );
  const routesToShow = allRoutes.filter(
    (current_route) => current_route.route_url !== path_name
  );

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
    <nav className="h-[10%] bg-white flex flex-row items-center px-4 justify-between">
      {/* For smaller screens Start*/}
      <div class="group inline-block relative md:hidden sm:w-[20%] xs:w-[40%]">
        <button class=" text-gray-700 font-semibold py-1 px-1 rounded inline-flex items-center">
          <span class="mr-1">{current_route_name[0].route_name}</span>
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>

        <ul class="absolute hidden text-gray-700 group-hover:block shadow-lg z-50 w-[200px] left-0 rounded-lg bg-white">
          {routesToShow.map(({ route_name, route_url, route_type }) =>
            route_type !== "admin" || (route_type === "admin" && isAdmin) ? (
              <li class="z-50 p-2 border-t border-gray-100 hover:bg-gray-50 rounded-t-lg">
                <Link
                  class="text-sm font-medium text-gray-800 bg-transparent block whitespace-no-wrap "
                  href={route_url}
                >
                  {route_name}
                </Link>
              </li>
            ) : (
              <></>
            )
          )}
        </ul>
      </div>
      {/* For smaller screens End*/}
      <div className="flex flex-row items-center lg:w-[31%] md:w-[35%] sm:w-[0%] xs:w-[0%]">
        <div className="md:hidden lg:block sm:hidden xs:hidden mr-3 mt-1">
          <Image
            src="/min_logo.gif"
            priority
            style={{ cursor: "pointer" }}
            width={70}
            height={30}
          />
        </div>
        <div
          className={`rounded-full ${
            path_name === "/dashboard" ? "bg-gray-900 px-3 py-2" : ""
          } lg:block md:block sm:hidden xs:hidden lg:mr-3 md:mr-3`}
        >
          <Link
            href="/dashboard/"
            className={`block py-2 ${
              path_name === "/dashboard" ? "text-white" : "text-black"
            } rounded md:p-0  font-semibold`}
          >
            Home
          </Link>
        </div>
        <div
          className={` rounded-full ${
            path_name === "/dashboard/my-projects"
              ? "bg-gray-900 px-3 py-2"
              : ""
          }  md:block sm:hidden xs:hidden  lg:mr-3  md:mr-3`}
        >
          <Link
            href="/dashboard/my-projects"
            className={`block py-2 ${
              path_name === "/dashboard/my-projects"
                ? "text-white"
                : "text-black"
            } rounded md:p-0  font-semibold`}
          >
            Projects
          </Link>
        </div>

        {user_detail.access === "admin" && (
          <div class="group inline-block relative sm:hidden xs:hidden md:block ">
            <button
              class={`  font-semibold  rounded-full inline-flex items-center ${
                current_route_name[0].route_type === "admin"
                  ? "bg-black text-white px-3 py-2"
                  : "text-gray-700"
              }`}
            >
              <span class="mr-1">Admin</span>
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>
            <ul class="absolute hidden text-gray-700 group-hover:block shadow-lg z-50 w-[200px] left-0 rounded-lg bg-white">
              <li class="z-50 p-2 border-t border-gray-100 hover:bg-gray-50 rounded-t-lg">
                <Link
                  class="text-sm font-medium text-gray-800 bg-transparent block whitespace-no-wrap "
                  href="/dashboard/AddEditProduct"
                >
                  Add/Edit Product
                </Link>
              </li>
              <li class="z-50 p-2 border-t border-gray-100 hover:bg-gray-50">
                <Link
                  class="text-sm font-medium text-gray-800 bg-transparent block whitespace-no-wrap "
                  href="/bulk-upload"
                >
                  Bulk Upload
                </Link>
              </li>
              <li class="z-50 p-2 border-t border-gray-100 hover:bg-gray-50 rounded-b-lg">
                <Link
                  class="text-sm font-medium text-gray-800 bg-transparent block whitespace-no-wrap"
                  href="/access"
                >
                  Access
                </Link>
              </li>
              <li class="z-50 p-2 border-t border-gray-100 hover:bg-gray-50 rounded-b-lg">
                <Link
                  class="text-sm font-medium text-gray-800 bg-transparent block whitespace-no-wrap"
                  href="/track-status"
                >
                  Track Status
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      {current_route_name[0].route_name === "Home" ? (
        <ProductSearchBar
          searchTags={searchTags}
          setSearchTags={setSearchTags}
          clearFilter={clearFilter}
          searchProductsByTags={searchProductsByTags}
          searchProductsByTagId={searchProductsByTagId}
        />
      ) : (
        <div className="px-2 pt-4 pb-3 sm:w-[70%] lg:w-[60%] xs:w-[30%]"></div>
      )}

      <div class="group inline-block relative md:w-[5%] sm:w-[8%] xs:w-[15%]">
        <button class=" text-gray-700 font-semibold py-1 px-1 rounded inline-flex items-center w-[60px]">
          <span class="mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fill-rule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>
        <ul class="absolute hidden text-gray-700 group-hover:block shadow-lg z-50 w-[250px] right-0 rounded-lg bg-white">
          <li class="z-50 rounded-t-lg flex flex-row items-center p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-9 h-9 mr-2"
            >
              <path
                fill-rule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <p className="text-md font-semibold text-gray-900 truncate">
                {user_detail.full_name}
              </p>
              <p className="text-sm text-gray-800 truncate">
                {user_detail.email}
              </p>
            </div>
          </li>
          <li class="z-50 p-2 border-t border-gray-200">
            <button
              class="text-md font-semibold text-black bg-white py-2 px-2 block whitespace-no-wrap "
              onClick={onLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NewNavbar;
