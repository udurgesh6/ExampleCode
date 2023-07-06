import React, { useEffect, useState } from "react";
import productStyles from "../../styles/product.module.css";
import { selectUserState } from "@/slices/userSlice";
import { useSelector } from "react-redux";
import { StarIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import axios from "axios";
import {
  selectProjectsState,
  addProductToProject,
  removeProductFromProject,
} from "@/slices/projectsSlice";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {
  selectFilteredProductsState,
  selectProductsState,
} from "@/slices/productsSlice";
import Link from "next/link";
import CloseSvg from "@/components/CloseSvg";
import CancelSvg from "@/components/CancelSvg";
import Image from "next/image";
import Head from "next/head";
import Cookies from "js-cookie";
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  try {
    const resp = await axios.get(
      `${process.env.HOST_NAME}/api/getProductsByKeywordSearch?keyword=${id}`
    );
    const theProduct = [...resp.data].filter(
      ({ product_id }) => product_id === id
    )[0];

    return {
      props: {
        productDetails: theProduct,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

const details = ({ productDetails }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user_details = useSelector(selectUserState);
  const products = useSelector(selectProductsState);
  const filteredProducts = useSelector(selectFilteredProductsState);
  const allProjectsOfUser = useSelector(selectProjectsState);
  const [productSelected] = useState(productDetails.product_id);
  const [productImages, setProductImages] = useState([]);
  const [projectsSelected, setProjectsSelected] = useState([]);
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [validUser, setValidUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("uid") && user_details?.user_id !== "") {
      setValidUser(user_details.user_id);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`../api/getProductImages?folder_name=${router.query.id}`)
      .then((all_product_images) => {
        let temp_product_images_main = [...all_product_images.data];
        temp_product_images_main = temp_product_images_main.filter(
          ({ key }) =>
            key.includes("jpg") ||
            key.includes("jpeg") ||
            key.includes("webp") ||
            key.includes("png")
        );
        let temp = temp_product_images_main.map(
          (current_product_image) => current_product_image.url
        );
        setProductImages(temp);
      });
    let temp_projectsSelected = [];
    allProjectsOfUser.forEach((current_project) => {
      console.log(current_project);
      let thisIsPresent =
        current_project.products.filter(
          (current_product_of_current_project) =>
            current_product_of_current_project.product_id === router.query.id
        ).length > 0;
      console.log(thisIsPresent);
      if (thisIsPresent) {
        temp_projectsSelected.push(current_project.project_id);
      }
    });
    console.log(temp_projectsSelected);
    setProjectsSelected(temp_projectsSelected);
  }, []);

  const onCancelProductsAddToProject = () => {
    setShowAddToProjectModal(false);
  };

  const selectOrUnSelectProjectsForProduct = (project_id) => {
    let temp_projectsSelected = [...projectsSelected];
    if (temp_projectsSelected.includes(project_id)) {
      temp_projectsSelected = temp_projectsSelected.filter(
        (tps) => tps !== project_id
      );
      setProjectsSelected(temp_projectsSelected);
    } else {
      setProjectsSelected([...temp_projectsSelected, project_id]);
    }
  };

  // const onSaveProductToSelectedProjects = () => {
  //   setLoading(true);
  //   allProjectsOfUser.forEach((current_project, current_project_index) => {
  //     if (projectsSelected.includes(current_project.project_id)) {
  //       let thisIsPresent =
  //         current_project.products.filter(
  //           (current_product_of_project) =>
  //             current_product_of_project.product_id === productSelected
  //         ).length > 0;
  //       if (!thisIsPresent) {
  //         axios.post("../api/addProductToProject", {
  //           product_id: productSelected,
  //           project_id: current_project.project_id,
  //           user_id: user_details.user_id,
  //         });
  //       }
  //     } else {
  //       let thisIsPresent =
  //         current_project.products.filter(
  //           (current_product_of_project) =>
  //             current_product_of_project.product_id === productSelected
  //         ).length > 0;
  //       if (thisIsPresent) {
  //         axios.delete(
  //           `../api/deleteProductFromProject?product_id=${productSelected}&project_id=${current_project.project_id}`
  //         );
  //       }
  //     }
  //     if (current_project_index === allProjectsOfUser.length - 1) {
  //       if (productSelected.length > 0) {
  //         dispatch(
  //           addOrRemoveProductFromProjects({
  //             projects: projectsSelected,
  //             ProductId: { product_id: productSelected },
  //           })
  //         );
  //         setShowAddToProjectModal(false);
  //       }
  //       setLoading(false);
  //     }
  //   });
  // };

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
          setShowAddToProjectModal(false);
          setLoading(false);
        }
      }
    );
  };

  const routeToMyProjects = () => {
    router.push("/dashboard/my-projects");
  };

  return (
    <>
      <Head>
        <title>{productDetails.name}</title>
        <meta
          property="og:url"
          content="https://boho-product-images.s3.ap-south-1.amazonaws.com"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://boho-product-images.s3.ap-south-1.amazonaws.com/Logos/authbg.jpg"
        />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <link rel="icon" href="/tab_logo.webp" />
        <meta property="og:title" content={productDetails.name} />
        <meta property="og:description" content={productDetails.description} />
        <meta property="og:type" content="website" />
      </Head>
      <div className={productStyles.main}>
        <div className="bg-white">
          <ToastContainer />
          <div className="pt-6">
            {productDetails && (
              <div className="flex flex-row justify-between mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <nav aria-label="Breadcrumb" className="">
                  <ol role="list" className=" flex items-center">
                    <li>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 ">
                          {productDetails.category}
                        </p>
                        <svg
                          width={16}
                          height={20}
                          viewBox="0 0 16 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-5 w-4 text-gray-300"
                        >
                          <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg>
                      </div>
                    </li>
                    <li className="text-sm">
                      <p
                        aria-current="page"
                        className="font-medium text-gray-500 hover:text-gray-600"
                      >
                        {productDetails.name}
                      </p>
                    </li>
                  </ol>
                </nav>

                {router.query.redirect && (
                  <Link
                    class="text-gray-900 font-bold"
                    href={decodeURI(router.query.redirect)}
                    title="Close Product"
                  >
                    <CloseSvg />
                  </Link>
                )}
              </div>
            )}

            {productDetails && (
              <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 mb-6 ">
                {productImages?.length > 0 && (
                  <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg lg:aspect-w-3 lg:aspect-h-3">
                    <Image
                      src={productImages[currentImageIndex]}
                      alt="Product Image"
                      className=" w-full object-cover object-center mb-8 border border-solid border-gray-300 sm:rounded-2xl shadow-xl"
                      height={700}
                      width={600}
                    />
                    <div className="flex flex-row mb-5 overflow-x-auto xs:px-4 sm:px-0">
                      {productImages.map((product_url, product_url_index) => (
                        <Image
                          src={product_url}
                          className={`object-cover object-center mr-4 rounded-xl border border-solid ${
                            currentImageIndex === product_url_index
                              ? "border-gray-400 shadow-2xl"
                              : "border-gray-300 shadow-lg"
                          } cursor-pointer hover:opacity-90 mb-4`}
                          key={product_url_index}
                          onClick={() =>
                            setCurrentImageIndex(product_url_index)
                          }
                          height={200}
                          width={160}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {productDetails && (
                  <div className="flex flex-col xs:px-4 sm:px-0">
                    <div className="w-full lg:border-r lg:border-gray-200 ">
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        {productDetails.name}
                      </h1>
                    </div>

                    {/* Options */}
                    <div className="mt-2 lg:row-span-3 lg:mt-0">
                      <h2 className="sr-only">Product information</h2>

                      {/* Reviews */}
                      <div className="mt-2">
                        <h3 className="sr-only">Reviews</h3>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                className={classNames(
                                  5 > rating
                                    ? "text-gray-900"
                                    : "text-gray-200",
                                  "h-5 w-5 flex-shrink-0"
                                )}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <p className="sr-only">
                            {reviews.average} out of 5 stars
                          </p>
                          <a className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            {reviews.totalCount} reviews
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="py-5 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
                      {/* Description and details */}
                      {validUser && (
                        <p>
                          Interested in the product? Simply click below to add
                          it to your project board and request a sample.
                        </p>
                      )}
                      {validUser && (
                        <button
                          class="mt-3 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg mb-3"
                          onClick={() => {
                            setShowAddToProjectModal(true);
                          }}
                        >
                          Add to project
                        </button>
                      )}
                      <div className="mt-3">
                        <h3 className="block text-lg font-medium text-gray-900">
                          Description
                        </h3>

                        <div className="space-y-6">
                          <p className="text-base text-gray-900">
                            {productDetails.description
                              .split("\n")
                              .map((line, index) => (
                                <p key={index}>
                                  {line}
                                  <br />
                                </p>
                              ))}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="block text-lg font-medium text-gray-900">
                          Specifications
                        </h3>

                        <div className="space-y-6">
                          <p className="text-base text-gray-900">
                            {productDetails.specifications
                              .split("\n")
                              .map((line, index) => (
                                <p key={index}>
                                  {line}
                                  <br />
                                </p>
                              ))}
                          </p>
                        </div>
                      </div>

                      {showAddToProjectModal && (
                        <div className="fixed z-10 inset-0 overflow-y-auto ">
                          <div className="flex items-center justify-center min-h-screen px-4">
                            <div
                              className="fixed inset-0 transition-opacity"
                              onClick={() => setShowAddToProjectModal(false)}
                            >
                              <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                            </div>
                            <div className="relative bg-white rounded-lg shadow  w-[350px]">
                              <div className="flex flex-row items-center justify-between p-4 border-b rounded-t ">
                                <h3 className="text-lg font-semibold text-gray-800  mr-2">
                                  Check projects to add this product to & call
                                  for sample 💫
                                </h3>
                                <button
                                  type="button"
                                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 ml-auto inline-flex items-center border border-gray-300"
                                  data-modal-hide="defaultModal"
                                  onClick={onCancelProductsAddToProject}
                                >
                                  <CancelSvg />
                                  <span className="sr-only">Close modal</span>
                                </button>
                              </div>
                              <div className="px-4 mt-2">
                                <div
                                  className="flex flex-row items-center pr-4 hover:bg-gray-200 p-2 rounded-lg cursor-pointer border border-gray-300 shadow-sm"
                                  onClick={routeToMyProjects}
                                >
                                  <div className="h-[38px] w-[38px] rounded-lg flex flex-row items-center justify-center border border-gray-200 shadow-md mr-2">
                                    <p className="font-bold text-2xl p-0 m-0 text-gray-800">
                                      +
                                    </p>
                                  </div>
                                  <p className=" text-md font-medium text-gray-700 cursor-pointer ">
                                    Create New
                                  </p>
                                </div>
                              </div>

                              {allProjectsOfUser.length > 0 ? (
                                <div className="p-4 space-y-3">
                                  <div className="max-h-[150px] overflow-y-auto">
                                    {allProjectsOfUser.map((current_project) =>
                                      current_project.status === "Locked" ? (
                                        <></>
                                      ) : (
                                        <div
                                          className="flex flex-row items-center justify-between mb-1 pr-4 hover:bg-gray-200 p-2 rounded-l-lg cursor-pointer"
                                          key={current_project.project_id}
                                          onClick={() =>
                                            selectOrUnSelectProjectsForProduct(
                                              current_project.project_id
                                            )
                                          }
                                        >
                                          <div className="flex flex-row items-center">
                                            <Image
                                              height="4"
                                              width="40"
                                              className="rounded-md mr-2 shadow-md"
                                              src={
                                                current_project.products
                                                  .length > 0
                                                  ? current_project.products[0]
                                                      .product.image_link
                                                  : "https://i.ibb.co/pWxB0Hf/Untitled-design-4.png"
                                              }
                                            />
                                            <label className=" text-md font-medium text-gray-700 cursor-pointer">
                                              {current_project.name}
                                            </label>
                                          </div>
                                          <input
                                            id={current_project.project_id}
                                            type="checkbox"
                                            checked={projectsSelected.includes(
                                              current_project.project_id
                                            )}
                                            className={
                                              "w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded-full "
                                            }
                                            onChange={() =>
                                              selectOrUnSelectProjectsForProduct(
                                                current_project.project_id
                                              )
                                            }
                                            disabled={
                                              current_project.status ===
                                              "Locked"
                                            }
                                            title={
                                              current_project.status ===
                                              "Locked"
                                                ? "This project's products have been already called for sample"
                                                : ""
                                            }
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="px-4 space-y-4 mt-4">
                                  <p className="text-md font-medium text-gray-700 ">
                                    No projects! Please create one to add
                                    products
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center p-4 space-x-2 border-t border-gray-200 rounded-b ">
                                {allProjectsOfUser.length > 0 && (
                                  <button
                                    data-modal-hide="defaultModal"
                                    type="button"
                                    className="text-white bg-gray-900 hover:bg-black  font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                                    onClick={onSaveProductToSelectedProjects}
                                  >
                                    {loading ? (
                                      <div className="flex flex-col items-center justify-center text-white">
                                        <div className="flex items-center justify-center">
                                          <div
                                            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status"
                                          >
                                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                              Loading...
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      "Save"
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {productDetails === null && (
              <div className="h-screen flex flex-col items-center justify-center text-black">
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
      </div>
    </>
  );
};

export default details;
