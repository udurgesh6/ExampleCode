import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cuid from "cuid";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import SidebarAndMainStyles from "../../styles/SidebarAndMain.module.css";
import NewNavbar from "@/components/NewNavbar";
import Head from "next/head";

function AddEditProduct() {
  const [files, setFiles] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    category: "",
    specifications: "",
  });
  const [defaultImage, setDefaultImage] = useState(null);
  const [pid, setPid] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [productsReceivedAfterSearch, setProductsReceivedAfterSearch] =
    useState([]);
  const [productSelected, setProductSelected] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedTillNow, setUploadedTillNow] = useState(null);
  const [selectedProductImages, setSelectedProductImages] = useState([]);

  const showImagesList = (files_rec) => {
    const file_names = [];
    for (let i = 0; i < files_rec.length; i++) {
      file_names.push(files_rec[i].name);
    }
    setFileNames(file_names);
  };

  const addNewProduct = () => {
    setProductDetails({
      name: "",
      description: "",
      category: "",
      specifications: "",
    });
    setDefaultImage(null);
    setPid(null);
    setProductSelected(null);
    setFileNames([]);
  };

  useEffect(() => {
    if (defaultImage) {
      setUploadedTillNow("Hang tight uploading Product Data...");
      axios
        .post("../api/addProduct", {
          product_id: pid,
          name: productDetails.name,
          image_link: defaultImage,
          description: productDetails.description,
          category: productDetails.category,
          specifications: productDetails.specifications,
        })
        .then((resp) => {
          toast("The product has been added successfully!");
          setProductSelected(resp.data);
          axios
            .get(`../api/getProductImages?folder_name=${pid}`)
            .then((all_product_images) => {
              let temp_all_product_images = [...all_product_images.data];
              temp_all_product_images = temp_all_product_images.filter(
                ({ key }) =>
                  key.includes("jpg") ||
                  key.includes("jpeg") ||
                  key.includes("webp") ||
                  key.includes("png")
              );
              setSelectedProductImages(temp_all_product_images);
            });
        })
        .catch(() => {
          toast("Something went wrong while adding the product...");
        })
        .finally(() => {
          setLoading(false);
          setUploadedTillNow(null);
        });
    }
  }, [defaultImage]);

  function handleUpload(e) {
    e.preventDefault();
    try {
      if (files && files["length"] > 0 && files["length"] < 5) {
        toast(
          "Our system is currently uploading your product. Please stand by..."
        );
        setUploadedTillNow("Hang tight uploading Product Images...");
        setLoading(true);
        const product_id = cuid();
        setPid(product_id);
        let all_promises = [];
        Array(files.length)
          .fill(0)
          .forEach(async (_, i) => {
            const formData = new FormData();
            formData.append("image", files[i]);

            let received_result = axios.post(
              `/api/uploadProductImage?product_id=${product_id}`,
              formData
            );
            all_promises.push(received_result);
          });
        Promise.all(all_promises)
          .then((values) => {
            setDefaultImage(values[0].data.defaultImageUrl);
          })
          .catch(() => {
            toast("Oops! An error occurred while adding the product.");
            setUploadedTillNow(null);
          });
      } else {
        toast("Oops! You can only upload up to four product images.");
      }
    } catch {
      setUploadedTillNow(null);
      toast("Oops! An error occurred while adding the product.");
      setLoading(false);
    }
  }

  const searchProduct = (e) => {
    e.preventDefault();
    axios
      .get(`../api/getProductsByKeywordSearch?keyword=${keyword}`)
      .then((resp) => {
        setProductsReceivedAfterSearch(resp.data);
        if (resp.data.length < 1) {
          toast(
            "We could not find any products matching your search criteria."
          );
        }
      })
      .catch(() => {
        toast("We encountered an error while searching for the product.");
      });
  };

  const selectProductToEdit = (ind) => {
    setProductSelected(productsReceivedAfterSearch[ind]);
    axios
      .get(
        `../api/getProductImages?folder_name=${productsReceivedAfterSearch[ind].product_id}`
      )
      .then((all_product_images) => {
        let temp_all_product_images = [...all_product_images.data];
        temp_all_product_images = temp_all_product_images.filter(
          ({ key }) =>
            key.includes("jpg") ||
            key.includes("jpeg") ||
            key.includes("webp") ||
            key.includes("png")
        );
        setSelectedProductImages(temp_all_product_images);
      });
    setProductDetails({
      name: productsReceivedAfterSearch[ind].name,
      description: productsReceivedAfterSearch[ind].description,
      category: productsReceivedAfterSearch[ind].category,
      specifications: productsReceivedAfterSearch[ind].specifications
        ? productsReceivedAfterSearch[ind].specifications
        : "",
    });
    setProductsReceivedAfterSearch([]);
    setKeyword("");
  };

  const updateProduct = (e) => {
    e.preventDefault();
    toast("Updating your product, please wait...");
    const updateProductData = () => {
      setLoading(true);
      setUploadedTillNow("Hang tight updating Product Data...");
      axios
        .put("../api/updateProduct", {
          product_id: productSelected.product_id,
          name: productDetails.name,
          description: productDetails.description,
          category: productDetails.category,
          specifications: productDetails.specifications,
        })
        .then(() => {
          toast("The product has been updated successfully!");
          setFileNames([]);
          setFiles(null);
        })
        .catch(() => {
          toast(
            "Sorry, there was an issue while trying to update the product."
          );
        })
        .finally(() => {
          setLoading(false);
          setUploadedTillNow(null);
        });
    };
    try {
      if (files && files["length"] > 0) {
        setUploadedTillNow("Hang tight uploading Product Images...");
        setLoading(true);
        let all_promises = [];
        Array(files.length)
          .fill(0)
          .forEach(async (_, i) => {
            const formData = new FormData();
            formData.append("image", files[i]);

            let received_result = axios.post(
              `/api/uploadProductImage?product_id=${productSelected.product_id}`,
              formData
            );
            all_promises.push(received_result);
          });
        Promise.all(all_promises)
          .then((values) => {
            let to_insert_images = values.map((current_value) => ({
              key: decodeURIComponent(
                current_value.data.defaultImageUrl
              ).substring(46),
              url: decodeURIComponent(current_value.data.defaultImageUrl),
            }));
            setSelectedProductImages([
              ...selectedProductImages,
              ...to_insert_images,
            ]);
            updateProductData();
          })
          .catch(() => {
            toast("Oops! An error occurred while adding the product.");
            setUploadedTillNow(null);
          });
      } else {
        updateProductData();
      }
    } catch {
      setUploadedTillNow(null);
      toast("Oops! An error occurred while adding the product.");
      setLoading(false);
    }
  };

  const deleteProduct = () => {
    if (
      window.confirm("Are your sure you want to delete this product?") === true
    ) {
      axios
        .get(
          `../api/getProductsByProductIdInProductsInProjectTable?keyword=${productSelected.product_id}`
        )
        .then((resp) => {
          if (resp.data.length < 1) {
            axios
              .delete(
                `../api/deleteProduct?keyword=${productSelected.product_id}`
              )
              .then(() => {
                axios
                  .delete(
                    `../api/deleteProductFolder?dir=${productSelected.product_id}`
                  )
                  .then((resp) => console.log(resp))
                  .catch((err) => console.log(err));
                toast("The product has been successfully deleted!");
                setProductDetails({
                  name: "",
                  description: "",
                  category: "",
                  specifications: "",
                });
                setProductSelected(null);
                setFiles(null);
                setPid(null);
                setKeyword("");
              })
              .catch(() =>
                toast("Some error occured while deleting the product!")
              )
              .finally(() => {
                setLoading(false);
              });
          } else {
            toast(
              "Removal of the product is not feasible as it is already part of one or more active projects."
            );
            setLoading(false);
          }
        })
        .catch(() => {
          toast("Some error occured while deleting the product!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteThisImage = (product_received) => {
    if (
      window.confirm("Are your sure you want to delete this product image?") ===
      true
    ) {
      axios
        .delete(`../api/deleteProductImage?key=${product_received.key}`)
        .then(() => {
          let temp_selectedProductImages = [...selectedProductImages];
          temp_selectedProductImages = temp_selectedProductImages.filter(
            (current_product_image) =>
              current_product_image.key !== product_received.key
          );
          setSelectedProductImages(temp_selectedProductImages);
        })
        .catch(() => {
          toast("Something went wrong while deleting this product image!");
        });
    }
  };

  const updateProductDefaultImageUrl = (image_link) => {
    if (
      window.confirm(
        "Are your sure you want to make this product image default?"
      ) === true
    ) {
      axios
        .put("../api/updateProductDefaultImageUrl", {
          product_id: productSelected.product_id,
          image_link: image_link,
        })
        .then(() => {
          toast("Selected image has been made the default one!");
          setProductSelected((productSelected) => ({
            ...productSelected,
            image_link: image_link,
          }));
        })
        .catch(() => {
          toast("Something went wrong while making this image a default one!");
        });
    }
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
      </Head>{" "}
      <div>
        <ToastContainer />
        <NewNavbar />
        <form
          className="md:pl-20 md:pr-20 pt-10 sm:pl-2 sm:pr-2"
          onSubmit={(e) => searchProduct(e)}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-t-lg bg-gray-50"
              placeholder="Search Product by name or product_id..."
              required
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
          {productsReceivedAfterSearch.length > 0 && (
            <div
              id="dropdown"
              className="z-10 bg-white divide-y divide-gray-100 rounded-b-lg shadow  dark:bg-gray-700 w-full"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                {productsReceivedAfterSearch.map((pras, pras_index) => (
                  <li
                    className="block px-4 py-2 hover:bg-gray-100 flex flex-row items-center cursor-pointer"
                    onClick={() => selectProductToEdit(pras_index)}
                    key={pras.image_link}
                  >
                    <Image
                      height={25}
                      width={22}
                      className="h-8 mr-3 rounded-sm"
                      src={pras.image_link}
                      alt="searched product image"
                    />
                    <p>
                      <span className="font-semibold">{pras.name}</span> -{" "}
                      {pras.product_id}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        <div className="md:pl-20 md:pr-20 pt-10 sm:pl-2 sm:pr-2">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Product Details
                </h3>
                <p className="mt-1 text-sm text-gray-700 mb-4">
                  Help buyers make informed decisions by including comprehensive
                  product details and compelling images.
                </p>
                {selectedProductImages.length > 0 && (
                  <>
                    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
                      Product Images
                    </h3>
                    <div className="flex flex-row flex-wrap">
                      {productSelected &&
                        selectedProductImages.map((current_image) => (
                          <div
                            className={SidebarAndMainStyles.addEditShowImage}
                            key={current_image.url}
                          >
                            <Image
                              src={current_image.url}
                              height={150}
                              width={120}
                              style={{ height: "150px", width: "120px" }}
                              className={`mr-3 mb-2 rounded-md ${
                                decodeURIComponent(
                                  productSelected.image_link
                                ).substring(
                                  productSelected.image_link.indexOf("com/") + 4
                                ) ===
                                current_image.url.substring(
                                  current_image.url.indexOf("com/") + 4
                                )
                                  ? "border border-solid border-gray-700 shadow-lg"
                                  : "shadow-md"
                              } `}
                              alt="current image"
                            />
                            {decodeURIComponent(
                              productSelected.image_link
                            ).substring(
                              productSelected.image_link.indexOf("com/") + 4
                            ) !==
                              current_image.url.substring(
                                current_image.url.indexOf("com/") + 4
                              ) && (
                              <button
                                className={SidebarAndMainStyles.deleteImage}
                                title="Delete Image"
                                onClick={() => deleteThisImage(current_image)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            )}
                            {decodeURIComponent(
                              productSelected.image_link
                            ).substring(
                              productSelected.image_link.indexOf("com/") + 4
                            ) !==
                              current_image.url.substring(
                                current_image.url.indexOf("com/") + 4
                              ) && (
                              <button
                                className={SidebarAndMainStyles.defaultImage}
                                title="Make Image Default"
                                onClick={() =>
                                  updateProductDefaultImageUrl(
                                    current_image.url
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form
                onSubmit={(e) => {
                  if (productSelected) {
                    updateProduct(e);
                  } else {
                    handleUpload(e);
                  }
                }}
              >
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="product_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="product_name"
                            id="product_name"
                            className="block w-full flex-1 rounded-md border border-solid border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="Textured soundproof wallpaper"
                            value={productDetails.name}
                            onChange={(e) =>
                              setProductDetails((productDetails) => ({
                                ...productDetails,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="product-description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="product-description"
                          name="product-description"
                          rows={2}
                          className="mt-1 block w-full rounded-md border border-solid border-gray-300  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                          placeholder="The product description..."
                          value={productDetails.description}
                          onChange={(e) => {
                            setProductDetails((productDetails) => ({
                              ...productDetails,
                              description: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="product-specifications"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Specifications
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="product-specifications"
                          name="product-specifications"
                          rows={2}
                          className="mt-1 block w-full rounded-md border border-solid border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                          placeholder="The product specifications..."
                          value={productDetails.specifications}
                          onChange={(e) => {
                            setProductDetails((productDetails) => ({
                              ...productDetails,
                              specifications: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>

                    <label
                      htmlFor="product-category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <ul className="w-48 text-sm font-medium text-gray-900 bg-white rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white pt-0">
                      <li className="w-full rounded-t-lg">
                        <div className="flex items-center pl-3">
                          <input
                            id="Wallpaper"
                            type="radio"
                            onChange={(e) =>
                              setProductDetails((productDetails) => ({
                                ...productDetails,
                                category: e.target.value,
                              }))
                            }
                            value="Wallpaper"
                            name="list-radio"
                            className="w-4 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700 "
                            required
                            checked={productDetails.category === "Wallpaper"}
                          />
                          <label
                            htmlFor="Wallpaper"
                            className="w-full ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Wallpaper
                          </label>
                        </div>
                      </li>
                    </ul>
                    {
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Select Images and Videos
                        </label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a Image/Video</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={(e) => {
                                    setFiles(e.target.files);
                                    showImagesList(e.target.files);
                                  }}
                                  multiple={true}
                                  accept="image/*,video/*"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to{" "}
                              <span className="text-gray-600 font-semibold">
                                4.5MB
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap mt-2">
                          {fileNames.map((fn) => (
                            <div
                              className="p-2 mr-2 bg-gray-300 rounded-md mb-1"
                              key={fn}
                            >
                              <p className="text-xs">{fn}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  </div>

                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    {!loading && (
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {productSelected ? "Update Product" : "Add Product"}
                      </button>
                    )}

                    {!loading && productSelected && (
                      <button
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-2 mr-2"
                        onClick={deleteProduct}
                        type="button"
                      >
                        Delete
                      </button>
                    )}
                    {!loading && productSelected && (
                      <button
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={addNewProduct}
                        type="button"
                      >
                        Add New Product
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        {uploadedTillNow && (
          <div className="fixed z-10 inset-0 overflow-y-auto ">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="relative bg-gray-800 rounded-lg shadow-lg ">
                <div className="flex items-start justify-between p-4 border-b border-gray-500 rounded-t ">
                  <h3 className="text-xl font-semibold text-white text-center w-full">
                    {uploadedTillNow}
                  </h3>
                </div>

                <div className="p-6 space-y-6 flex flex-col items-center justify-center">
                  <Image
                    height={300}
                    width={300}
                    src="/uploading.gif"
                    className="rounded-md shadow-sm"
                    alt="Uploading Image"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddEditProduct;
