import React, { useState, useEffect } from "react";
import SidebarAndMainStyles from "../../styles/SidebarAndMain.module.css";
import {
  loadProjects,
  addProductToProject,
  removeProductFromProject,
} from "@/slices/projectsSlice";
import {
  addProducts,
  addFilteredProducts,
  selectFilteredProductsState,
  selectedProductFilter,
  selectProductsState,
  clearFilteredProducts,
  selectedFilteredPage,
  selectedPage,
  selectedFilterId,
} from "@/slices/productsSlice";
import { selectProjectsState } from "@/slices/projectsSlice";
import { selectUserState } from "@/slices/userSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import Router from "next/router";
import SidebarOptions from "../../components/SidebarOptions";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import AddToProjectModal from "../../components/Dashboard/AddToProjectModal";
import ViewDetailsSvg from "@/components/ViewDetailsSvg";
import Cookies from "js-cookie";
import { clearUserDetail } from "@/slices/userSlice";
import { clearProjectsData } from "@/slices/projectsSlice";
import { clearProductsData } from "@/slices/productsSlice";
import Image from "next/image";
import NewNavbar from "@/components/NewNavbar";
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
import Masonry from "react-masonry-css";
import Head from "next/head";

const SidebarAndMain = () => {
  const dispatch = useDispatch();
  const allProjectsOfUser = useSelector(selectProjectsState);
  const user_details = useSelector(selectUserState);
  const products = useSelector(selectProductsState);
  const filteredProducts = useSelector(selectFilteredProductsState);
  const productFilter = useSelector(selectedProductFilter);
  const page = useSelector(selectedPage);
  const filteredPage = useSelector(selectedFilteredPage);
  const filterId = useSelector(selectedFilterId);
  const domainUrl = `${
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : window.location.hostname
  }`;
  const [productsToShow, setProductsToShow] = useState(products);
  const [searchTags, setSearchTags] = useState("");
  const [productSelected, setProductSelected] = useState("");
  const [projectsSelected, setProjectsSelected] = useState([]);
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [categories, setCategories] = useState([
    { type: "Wallpapers", checked: true },
    { type: "Tiles", checked: false },
    { type: "Laminates", checked: false },
    { type: "Rugs", checked: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productClicked, setProductClicked] = useState(null);
  const [fetchingNewProducts, setFetchingNewProducts] = useState(false);
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  const [noMoreFilteredProducts, setNoMoreFilteredProducts] = useState(false);

  const handleDownload = (rec_image_url) => {
    const link = document.createElement("a");
    link.href = rec_image_url;
    link.download = "image.jpg";
    link.click();
  };

  useEffect(() => {
    if (Cookies.get("uid") && user_details?.user_id?.length > 0) {
      if (products.length < 1) {
        setLoadingProducts(true);
        axios
          .get("../api/getProducts?page=1")
          .then((resp) => {
            if (resp.status === 200) {
              dispatch(addProducts({ products: resp.data, page: 1 }));
              if (filteredProducts.length > 0) {
                setProductsToShow(filteredProducts);
                setSearchTags(productFilter);
              } else {
                setProductsToShow(resp.data);
              }
            }
          })
          .catch((err) => {
            toast("Something went wrong while getting products!");
            console.log(err);
          })
          .finally(() => setLoadingProducts(false));
      } else {
        if (filteredProducts.length > 0) {
          setProductsToShow(filteredProducts);
          setSearchTags(productFilter);
        } else {
          setProductsToShow(products);
        }
      }

      axios
        .get(`../api/getProjects?user_id=${user_details.user_id}`)
        .then((projects_received) => {
          if (projects_received.status === 200) {
            let tall_project_detail = projects_received.data.map(
              (current_project) => ({
                ...current_project,
                products: current_project.ProductsInProject,
              })
            );
            dispatch(loadProjects(tall_project_detail));
          } else {
            toast("Something went wrong while getting your projects!");
          }
        });
    } else {
      dispatch(clearUserDetail());
      dispatch(clearProjectsData());
      dispatch(clearProductsData());
      Router.push({
        pathname: "/auth/authenticate",
        query: { authType: "login" },
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight -
        Math.ceil(e.target.scrollTop) -
        Math.ceil(e.target.clientHeight) <
        3 ||
      e.target.scrollHeight -
        Math.ceil(e.target.scrollTop) -
        Math.ceil(e.target.clientHeight) >
        0;
    if (bottom) {
      if (filteredProducts.length < 1 && !noMoreProducts && bottom) {
        loadMoreProducts();
      }
      if (filteredProducts.length > 0 && !noMoreFilteredProducts && bottom) {
        loadMoreProducts();
      }
    }
  };

  const loadMoreProducts = () => {
    try {
      if (filteredProducts.length > 0) {
        setFetchingNewProducts(true);
        const fn2 = async () => {
          const nextPage = filteredPage + 1;
          const response = await axios.get(
            `../api/searchProductsByTags?tags=${searchTags}&page=${nextPage}`
          );
          if (response.data.length > 0) {
            dispatch(
              addFilteredProducts({
                filtered_products: [...filteredProducts, ...response.data],
                filter: searchTags,
                filteredPage: nextPage,
                filterId: filterId,
              })
            );
            setProductsToShow([...filteredProducts, ...response.data]);
          } else {
            setNoMoreFilteredProducts(true);
          }
          setFetchingNewProducts(false);
        };
        setTimeout(fn2, 2000);
      } else {
        setFetchingNewProducts(true);
        const myfn = async () => {
          const nextPage = page + 1;
          const response = await axios.get(
            `../api/getProducts?page=${nextPage}`
          );
          if (response.data.length > 0) {
            dispatch(
              addProducts({
                products: [...products, ...response.data],
                page: nextPage,
              })
            );
            setProductsToShow([...productsToShow, ...response.data]);
          } else {
            setNoMoreProducts(true);
          }
          setFetchingNewProducts(false);
        };
        setTimeout(myfn, 2000);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      setFetchingNewProducts(false);
    } finally {
      setLoadingProducts(false);
    }
  };

  const onCancelProductsAddToProject = () => {
    setProjectsSelected([]);
    setShowAddToProjectModal(false);
    setProductSelected("");
  };

  const onSaveProductToSelectedProjects = () => {
    setLoading(true);
    // go through each project created by the user
    allProjectsOfUser.forEach(
      async (current_project, current_project_index) => {
        // check if the current project is there in the projectsSelected list
        if (projectsSelected.includes(current_project.project_id)) {
          // check if in this project's products list there is this product present
          let thisIsPresent =
            current_project.products.filter(
              (current_project_product) =>
                current_project_product.product_id === productSelected
            ).length > 0;
          // if the product isnt present add it
          if (!thisIsPresent) {
            const product_added_detail = await axios.post(
              "../api/addProductToProject",
              {
                product_id: productSelected,
                project_id: current_project.project_id,
                user_id: user_details.user_id,
              }
            );
            let current_product =
              filteredProducts.length < 1
                ? products.filter(
                    (product) => product.product_id === productSelected
                  )
                : filteredProducts.filter(
                    (product) => product.product_id === productSelected
                  );
            dispatch(
              addProductToProject({
                ...product_added_detail.data,
                product: current_product[0],
              })
            );
          }
        } else {
          let thisIsPresent =
            current_project.products.filter(
              (current_product_of_current_project) =>
                current_product_of_current_project.product_id ===
                productSelected
            ).length > 0;
          if (thisIsPresent) {
            await axios.delete(
              `../api/deleteProductFromProject?product_id=${productSelected}&project_id=${current_project.project_id}`
            );
            dispatch(
              removeProductFromProject({
                project_id: current_project.project_id,
                product_id: productSelected,
              })
            );
          }
        }
        if (current_project_index === allProjectsOfUser.length - 1) {
          if (productSelected.length > 0) {
            setProjectsSelected([]);
            setShowAddToProjectModal(false);
            setProductSelected("");
          }
          setLoading(false);
        }
      }
    );
  };

  const selectProductAndSeeWhereLinked = (product_selected_id) => {
    setProductSelected(product_selected_id);
    let temp_projectsSelected = [];
    allProjectsOfUser.forEach((current_project) => {
      let thisIsPresent =
        current_project.products.filter(
          (current_product_of_current_project) =>
            current_product_of_current_project.product_id ===
            product_selected_id
        ).length > 0;
      if (thisIsPresent) {
        temp_projectsSelected.push(current_project.project_id);
      }
    });
    setProjectsSelected(temp_projectsSelected);
    setShowAddToProjectModal(true);
  };

  const searchProductsByTags = (e, searchTags) => {
    e.preventDefault();
    setLoadingProducts(true);
    axios
      .get(`../api/searchProductsByTags?tags=${searchTags}&page=1`)
      .then((resp) => {
        if (resp.data.length < 1) {
          toast("No products found...");
        } else {
          setProductsToShow(resp.data);
          dispatch(
            addFilteredProducts({
              filtered_products: resp.data,
              filter: searchTags,
              filteredPage: 1,
            })
          );
        }
      })
      .catch((err) => {
        toast("Something went wrong while searching for products!");
        console.log(err);
      })
      .finally(() => setLoadingProducts(false));
  };

  const searchProductsByTagId = (tag_name, tag_id) => {
    console.log(tag_id);
    setLoadingProducts(true);
    axios
      .get(`../api/searchProductsByTagId?tag_id=${tag_id}&page=1`)
      .then((resp) => {
        if (resp.data.length < 1) {
          toast("No products found...");
        } else {
          let rec_products = resp.data.map(
            (current_product) => current_product.product
          );
          setProductsToShow(rec_products);
          dispatch(
            addFilteredProducts({
              filtered_products: rec_products,
              filter: tag_name,
              filteredPage: 1,
              filterId: tag_id,
            })
          );
        }
      })
      .catch((err) => {
        toast("Something went wrong while searching for products!");
        console.log(err);
      })
      .finally(() => setLoadingProducts(false));
  };

  const clearFilter = () => {
    setProductsToShow(products);
    dispatch(clearFilteredProducts());
  };

  return (
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
      <div className={SidebarAndMainStyles.sidebarAndMain}>
        <ToastContainer />
        <NewNavbar
          searchProductsByTags={searchProductsByTags}
          clearFilter={clearFilter}
          searchTags={searchTags}
          setSearchTags={setSearchTags}
          searchProductsByTagId={searchProductsByTagId}
        />
        <div className={SidebarAndMainStyles.sidebarAndMain__bottom}>
          {/* <aside
          id="default-sidebar"
          className="fixed left-0 z-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 overflow-auto pb-10"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <SidebarOptions
              options={categories}
              setOptions={setCategories}
              optionsType="Categories"
            />
          </div>
        </aside> */}

          <div
            className="flex flex-col overflow-auto w-full scroll-smooth pt-4 bg-white"
            onScroll={handleScroll}
          >
            {!loadingProducts && (
              <Masonry
                breakpointCols={{
                  default: 5,
                  1100: 3,
                  700: 2,
                  500: 2,
                }}
                className={`${SidebarAndMainStyles.my_masonry_grid} px-2`}
                columnClassName={`${SidebarAndMainStyles.my_masonry_grid_column} `}
              >
                {productsToShow?.map((current_product) => (
                  <div
                    className={SidebarAndMainStyles.showImage}
                    key={current_product.product_id}
                    onMouseEnter={() => {
                      if (
                        productClicked &&
                        productClicked !== current_product.product_id
                      ) {
                        setProductClicked(null);
                      }
                    }}
                  >
                    <Image
                      src={current_product.image_link}
                      alt={current_product.name}
                      width={300}
                      height={360}
                      className="shadow-xl"
                    />
                    <input
                      className={SidebarAndMainStyles.addToProject}
                      onClick={() =>
                        selectProductAndSeeWhereLinked(
                          current_product.product_id
                        )
                      }
                      value="Add"
                      type="button"
                    />
                    <div className="px-2 ">
                      <div className="flex flex-row items-center ">
                        <p className="text-sm flex flex-row items-center justify-between">
                          <Link
                            className="w-[60%] truncate bg-white shadow-md p-3 rounded-full font-semibold mr-2 cursor-pointer text-black"
                            href={`/product/details?id=${
                              current_product.product_id
                            }&redirect=${encodeURI("/dashboard")}`}
                          >
                            {current_product.name}
                          </Link>
                          <span className="bg-white  shadow-md px-2 pt-2 pb-1  rounded-full">
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
                                class="z-30 bg-white divide-y divide-gray-100 rounded-lg shadow w-full rounded-lg shadow-lg top-12"
                              >
                                <ul
                                  class="py-2 bg-white z-30 text-sm text-gray-700   rounded-lg shadow-lg"
                                  aria-labelledby="dropdownHoverButton"
                                >
                                  <li className="w-full flex flex-row justify-center mb-2 font-medium">
                                    <p>Share</p>
                                  </li>
                                  <li className="pt-3 flex flex-wrap items-center px-2">
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
                                        className="mr-2  mb-2"
                                        href={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                      />
                                    </TwitterShareButton>
                                    <FacebookMessengerShareButton
                                      url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                    >
                                      <FacebookMessengerIcon
                                        size={32}
                                        round
                                        className="mr-2  mb-2"
                                      />
                                    </FacebookMessengerShareButton>
                                    <WhatsappShareButton
                                      url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                    >
                                      <WhatsappIcon
                                        size={32}
                                        round
                                        className="mr-2  mb-2"
                                      />
                                    </WhatsappShareButton>
                                    <TelegramShareButton
                                      url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                    >
                                      <TelegramIcon
                                        size={32}
                                        round
                                        className="mr-2  mb-2"
                                      />
                                    </TelegramShareButton>
                                    <LinkedinShareButton
                                      url={`${domainUrl}/product/details?id=${current_product.product_id}`}
                                    >
                                      <LinkedinIcon
                                        size={32}
                                        round
                                        className="mr-2  mb-2"
                                      />
                                    </LinkedinShareButton>
                                    <button
                                      className="border border-gray-600 rounded-full flex flex-row items-center justify-center mb-2 mr-2 p-1"
                                      title="Copy Url"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          `${domainUrl}/product/details?id=${current_product.product_id}`
                                        );
                                        toast(
                                          "Product url copied to clipboard."
                                        );
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

                          <span
                            className="bg-white  shadow-md p-2 rounded-full cursor-pointer"
                            onClick={() =>
                              handleDownload(current_product.image_link)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-5 h-5 text-black"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            )}

            {fetchingNewProducts && (
              <div className="mt-2 px-4 w-full flex flex-col items-center justify-center text-black">
                <div class="flex items-center justify-center w-full mb-4">
                  <div
                    class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </div>
              </div>
            )}
            {loadingProducts && (
              <div className="px-4 h-screen flex flex-col items-center justify-center text-black">
                <div class="flex items-center justify-center">
                  <div
                    class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* This is a component(Modal) which when visible helps to add/remove certain product from projects created */}
        {showAddToProjectModal && (
          <AddToProjectModal
            setShowAddToProjectModal={setShowAddToProjectModal}
            onCancelProductsAddToProject={onCancelProductsAddToProject}
            allProjectsOfUser={allProjectsOfUser}
            projectsSelected={projectsSelected}
            onSaveProductToSelectedProjects={onSaveProductToSelectedProjects}
            setProjectsSelected={setProjectsSelected}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default SidebarAndMain;
