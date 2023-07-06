import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import SidebarAndMainStyles from "../../styles/SidebarAndMain.module.css";
import Masonry from "react-masonry-css";
import axios from "axios";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Head from "next/head";
const index = () => {
  const domainUrl = `${
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : window.location.hostname
  }`;
  const router = useRouter();
  const [shareClicked, setShareClicked] = useState(false);
  const [projectLoaded, setProjectLoaded] = useState(null);
  const [productClicked, setProductClicked] = useState(null);

  const onBohoClick = () => {
    Router.push({
      pathname: "/auth/authenticate",
      query: { authType: "login" },
    });
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    axios
      .get(`../api/getProjectDetail?project_id=${router.query.id}`)
      .then((resp) => {
        console.log(resp.data);
        setProjectLoaded(resp.data);
      })
      .catch(() => {
        toast("Something went wrong while getting the product details");
      });
  }, [router.isReady]);

  return projectLoaded ? (
    <>
      <Head>
        <title>boho</title>
        <meta
          name="description"
          content="Helping interior designers build better tomorrow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tab_logo.webp" />
      </Head>
      <div className="flex flex-col w-full items-center  mb-4 h-screen bg-white ">
        <ToastContainer />

        <div className="w-full border-b border-gray-300 flex flex-row justify-center rounded-b-3xl shadow-xl mb-6 md:px-20">
          <Image
            src="/min_logo.gif"
            priority
            width={80}
            height={30}
            onClick={onBohoClick}
            className="cursor-pointer"
          />
        </div>
        <p className="text-gray-900 text-3xl font-bold mb-1 p-2 rounded-md">
          {projectLoaded.name}
        </p>
        {projectLoaded.ProductsInProject.length > 0 && (
          <p className="text-gray-800 text-lg font-semibold mb-3">
            ({projectLoaded.ProductsInProject[0].status})
          </p>
        )}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center ">
            <div>
              <button
                title="Share Project"
                className="p-3 border border-blue-400 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md relative"
                id="dropdownHoverButton"
                type="button"
                onClick={() => setShareClicked((shareClicked) => !shareClicked)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
                {shareClicked && (
                  <div
                    id="dropdownHover"
                    class="z-30 bg-white divide-y divide-gray-100 rounded-lg shadow  rounded-lg shadow-lg top-16 left-0 absolute "
                  >
                    <ul
                      class="py-2 bg-white z-30 text-sm text-gray-700   rounded-lg shadow-lg"
                      aria-labelledby="dropdownHoverButton"
                    >
                      <li className="w-full flex flex-row justify-center mb-2">
                        <p className="font-medium">Share</p>
                      </li>
                      <li className="flex flex-col items-center px-3">
                        <FacebookShareButton
                          url={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                        >
                          <FacebookIcon size={32} round className="mb-2" />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                        >
                          <TwitterIcon
                            size={32}
                            round
                            className="mb-2"
                            href={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                          />
                        </TwitterShareButton>
                        <FacebookMessengerShareButton
                          url={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                        >
                          <FacebookMessengerIcon
                            size={32}
                            round
                            className="mb-2"
                          />
                        </FacebookMessengerShareButton>
                        <WhatsappShareButton
                          url={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                        >
                          <WhatsappIcon size={32} round className="mb-2" />
                        </WhatsappShareButton>
                        <TelegramShareButton
                          url={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                        >
                          <TelegramIcon size={32} round className="mb-2" />
                        </TelegramShareButton>
                        <LinkedinShareButton
                          url={`${domainUrl}/project?id=${projectLoaded.project_id}`}
                        >
                          <LinkedinIcon size={32} round className=" mb-2" />
                        </LinkedinShareButton>
                        <button
                          className="border border-gray-600 rounded-full flex flex-row items-center justify-center mb-2 p-1"
                          title="Copy Url"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${domainUrl}/project?id=${projectLoaded.project_id}`
                            );
                            toast("Product url copied to clipboard.");
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5  text-black"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                            />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        {projectLoaded.ProductsInProject.length > 0 ? (
          <div className="mt-4 w-full py-5 flex flex-row justify-center">
            <ToastContainer />
            <Masonry
              breakpointCols={
                projectLoaded.ProductsInProject.length < 4
                  ? {
                      default: projectLoaded.ProductsInProject.length,
                      1100: projectLoaded.ProductsInProject.length,
                      700:
                        projectLoaded.ProductsInProject.length > 2
                          ? 3
                          : projectLoaded.ProductsInProject.length,
                      600:
                        projectLoaded.ProductsInProject.length > 2
                          ? 2
                          : projectLoaded.ProductsInProject.length,
                    }
                  : {
                      default: 4,
                      700: 3,
                      550: 2,
                    }
              }
              className={`${SidebarAndMainStyles.my_masonry_grid} px-2 `}
              columnClassName={`${SidebarAndMainStyles.my_masonry_grid_column}`}
            >
              {projectLoaded.ProductsInProject.map((current_product) => (
                <div
                  className={SidebarAndMainStyles.showImage}
                  key={current_product.product_id}
                >
                  <Image
                    src={current_product.product.image_link}
                    height={200}
                    width={200}
                    className="rounded-xl shadow-md min-w-[150px]"
                  />
                  <div className="px-2 ">
                    <div className="flex flex-row items-center ">
                      <p className="text-sm flex flex-row items-center justify-between">
                        <Link
                          className="w-[60%] truncate bg-white shadow-md p-3 rounded-full font-semibold mr-2 cursor-pointer text-black"
                          href={`/product/details?id=${
                            current_product.product_id
                          }&redirect=${encodeURI("/dashboard/my-projects")}`}
                        >
                          {current_product.product.name}
                        </Link>
                        <span className="bg-white  shadow-md px-1 pt-1 rounded-full">
                          <button
                            id="dropdownHoverButton"
                            type="button"
                            onClick={() =>
                              setProductClicked((productClicked) =>
                                productClicked === current_product.product_id
                                  ? null
                                  : current_product.product_id
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-4 h-4 text-black"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                              />
                            </svg>
                          </button>
                          {productClicked === current_product.product_id && (
                            <div
                              id="dropdownHover"
                              class="z-30 bg-white divide-y divide-gray-100 rounded-lg shadow  rounded-lg shadow-lg top-12"
                            >
                              <ul
                                class="py-2 bg-white z-30 text-sm text-gray-700   rounded-lg shadow-lg"
                                aria-labelledby="dropdownHoverButton"
                              >
                                <li className="w-full flex flex-row justify-center mb-2">
                                  <p className="font-medium">Share</p>
                                </li>
                                <li className="flex flex-wrap items-center px-2">
                                  <FacebookShareButton
                                    url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                  >
                                    <FacebookIcon
                                      size={32}
                                      round
                                      className="mr-2 mb-2"
                                    />
                                  </FacebookShareButton>
                                  <TwitterShareButton
                                    url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                  >
                                    <TwitterIcon
                                      size={32}
                                      round
                                      className="mr-2 mb-2"
                                      href={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                    />
                                  </TwitterShareButton>
                                  <FacebookMessengerShareButton
                                    url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                  >
                                    <FacebookMessengerIcon
                                      size={32}
                                      round
                                      className="mr-2 mb-2"
                                    />
                                  </FacebookMessengerShareButton>
                                  <WhatsappShareButton
                                    url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                  >
                                    <WhatsappIcon
                                      size={32}
                                      round
                                      className="mr-2 mb-2"
                                    />
                                  </WhatsappShareButton>
                                  <TelegramShareButton
                                    url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                  >
                                    <TelegramIcon
                                      size={32}
                                      round
                                      className="mr-2 mb-2"
                                    />
                                  </TelegramShareButton>
                                  <LinkedinShareButton
                                    url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                  >
                                    <LinkedinIcon
                                      size={32}
                                      round
                                      className="mr-2.5 mb-2"
                                    />
                                  </LinkedinShareButton>
                                  <button
                                    className="border border-gray-600 rounded-full flex flex-row items-center justify-center mb-2 mr-2 p-1"
                                    title="Copy Url"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `${domainUrl}/product/details?id=${current_product.product_id}`
                                      );
                                      toast("Product url copied to clipboard.");
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="w-5 h-5  text-black"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                      />
                                    </svg>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src="/no_products.webp"
              width={250}
              height={250}
              className="mb-3 rounded-md"
              alt="No projects"
            />
            <p className="text-lg font-">No products to show!</p>
            <p className="text-lg font-">Please add one to call for sample</p>
          </div>
        )}
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <p>Loading...</p>
    </div>
  );
};

export default index;
