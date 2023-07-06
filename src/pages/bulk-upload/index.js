import React, { useState, useEffect } from "react";
import cuid from "cuid";
import { read, utils } from "xlsx";
import axios from "axios";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewNavbar from "@/components/NewNavbar";
import Head from "next/head";
const index = () => {
  const [bulkUploadingStage, setBulkUploadingStage] = useState(1);
  const [productDetails, setProductDetails] = useState(null);
  const [toUpload, setToUpload] = useState("tags");
  const [tagsUploadedTillNow, setTagsUploadedTillNow] = useState(null);
  useEffect(() => {
    if (bulkUploadingStage === 6) {
      let temp_productDetails = [...productDetails];
      const keys = temp_productDetails[0];
      const result = [];

      for (let i = 1; i < temp_productDetails.length; i++) {
        const obj = {};
        for (let j = 0; j < keys.length; j++) {
          obj[keys[j]] = String(temp_productDetails[i][j]);
        }
        result.push(obj);
      }
      axios
        .post("../api/uploadBulkProductsData", {
          productData: JSON.stringify(result),
        })
        .then(() => {
          toast("Data saved successfully", {
            autoClose: false,
          });
        })
        .catch((err) => {
          console.log(err);
          toast("Something went wrong while saving the data!", {
            autoClose: false,
          });
        })
        .finally(() => {
          setBulkUploadingStage(1);
          setProductDetails(null);
        });
    }
  }, [bulkUploadingStage]);

  useEffect(() => {
    axios
      .get("../api/getAllTags")
      .then((resp) => {
        let obj = {};
        resp.data.forEach(({ tag_name, tag_id }) => (obj[tag_name] = tag_id));
        setTagsUploadedTillNow(obj);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFileUpload = (event, upload_type) => {
    try {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = utils.sheet_to_json(worksheet, { header: 1 });

        if (upload_type === "basic") {
          jsonData = jsonData.filter((subArray) => subArray.length > 0);
          if (
            jsonData.every((subArray) => subArray.length === jsonData[0].length)
          ) {
            console.log(
              jsonData[0][0] === "product_id",
              jsonData[0][1] === "name",
              jsonData[0][2] === "description",
              jsonData[0][3] === "category",
              jsonData[0][4] === "image_link"
            );
            if (
              jsonData[0][0] === "product_id" &&
              jsonData[0][1] === "name" &&
              jsonData[0][2] === "description" &&
              jsonData[0][3] === "category" &&
              jsonData[0][4] === "image_link"
            ) {
              setBulkUploadingStage(3);
              const myfn1 = () => {
                jsonData[0].push("specifications");
                console.log(jsonData);
                setProductDetails(jsonData);
                setBulkUploadingStage(4);
              };
              setTimeout(myfn1, 5000);
            } else {
              toast("Something wrong with the placement of headers!", {
                autoClose: false,
              });
              setBulkUploadingStage(1);
            }
          } else {
            toast(
              "Some data points are missing for certain products in the basic data sheet.",
              { autoClose: false }
            );
            setBulkUploadingStage(1);
          }
        }
        if (upload_type === "specs") {
          jsonData = jsonData.filter((subArray) => subArray.length > 0);
          if (
            jsonData.every((subArray) => subArray.length === jsonData[0].length)
          ) {
            if (jsonData.length === productDetails.length) {
              setBulkUploadingStage(5);
              const myfn2 = () => {
                let basic_details = [...productDetails];
                let someError = -1;
                for (let i = 1; i < basic_details.length; i++) {
                  if (basic_details[i][0] !== jsonData[i][0]) {
                    someError = i;
                    break;
                  }
                  let spec = ``;
                  for (let j = 1; j < jsonData[i].length; j++) {
                    spec = spec + jsonData[0][j] + ": " + jsonData[i][j] + "\n";
                  }
                  basic_details[i].push(spec);
                }

                if (someError > -1) {
                  toast(
                    `The product_id is not consistent between the basic data sheet and specifications sheet at row no. ${someError} of the specifications sheet!`,
                    { autoClose: false }
                  );
                  setBulkUploadingStage(1);
                } else {
                  setBulkUploadingStage(6);
                }
              };
              setTimeout(myfn2, 5000);
            } else {
              toast(
                "The number of rows does not match between the basic data sheet and the specifications sheet.",
                { autoClose: false }
              );
              setBulkUploadingStage(1);
            }
          } else {
            toast(
              "Some data points are missing for certain products in the specification sheet.",
              { autoClose: false }
            );
            setBulkUploadingStage(1);
          }
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      toast("Something wrong with the file, cannot read...", {
        autoClose: false,
      });
      setBulkUploadingStage(1);
    }
  };

  const handleTagsFileUpload = (event) => {
    try {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = utils.sheet_to_json(worksheet, { header: 1 });
        jsonData = jsonData.filter((curren_tag) => curren_tag?.length > 0);
        let dataToSend = jsonData.map((current_tag) => ({
          tag_name: current_tag[0].toLowerCase(),
          tag_id: cuid(),
        }));
        function removeDuplicates(array) {
          const seen = {};
          return array.filter((obj) => {
            if (!seen[obj.tag_name]) {
              seen[obj.tag_name] = true;
              return true;
            }
            return false;
          });
        }
        dataToSend = removeDuplicates(dataToSend);
        console.log(dataToSend.slice(1));
        axios
          .post("../api/uploadBulkTags", {
            tagsData: JSON.stringify(dataToSend.slice(1)),
          })
          .then((resp) => console.log(resp))
          .catch((err) => console.log(err));
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      toast("Something wrong with the file, cannot read...", {
        autoClose: false,
      });
    }
  };

  const handleProductsTagFileUpload = (event) => {
    try {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = utils.sheet_to_json(worksheet, { header: 1 });
        jsonData = jsonData.filter((curren_tag) => curren_tag?.length > 0);
        let toUpload = [];
        if (jsonData[0][0] === "product_id" && jsonData[0][1] === "tags") {
          jsonData.forEach((current_data, current_index) => {
            if (current_index > 0) {
              let trimmed_product_id = String(current_data[0]).trim();
              console.log(current_data[1]);
              let trimmed_tags = current_data[1]
                .split(",")
                .map((tag) =>
                  tagsUploadedTillNow[tag.trim()]
                    ? tagsUploadedTillNow[tag.trim()]
                    : undefined
                );
              trimmed_tags = trimmed_tags.filter(
                (current_trimmed_tag) => current_trimmed_tag !== undefined
              );
              console.log(trimmed_tags);
              trimmed_tags.forEach((tag_id) => {
                toUpload.push({
                  product_id: trimmed_product_id,
                  tag_id: tag_id,
                });
              });
            }
          });
          // axios
          //   .post("../api/uploadBulkProductsTagged", {
          //     taggedData: JSON.stringify(toUpload),
          //   })
          //   .then((resp) => {
          //     console.log(resp);
          //     toast("Products tagged successfully");
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //     toast("Something went wrong while tagging the product");
          //   });
        } else {
          toast("Headers missing or invalid");
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      toast("Something wrong with the file, cannot read...", {
        autoClose: false,
      });
    }
  };

  const onReset = () => {
    setBulkUploadingStage(1);
    setProductDetails(null);
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
      <div className="h-screen">
        <NewNavbar />
        <ToastContainer />
        <div className="h-[90%] flex flex-col items-center justify-center bg-white">
          <div className="flex flex-row mb-4">
            <p
              className={`mr-3 p-2 border ${
                toUpload === "products"
                  ? "border-gray-600 font-semibold shadow-lg"
                  : "border-gray-400"
              } rounded-md cursor-pointer`}
              onClick={() => setToUpload("products")}
            >
              Upload Products
            </p>
            <p
              className={`p-2 border  ${
                toUpload === "tags"
                  ? "border-gray-600  font-semibold  shadow-lg"
                  : "border-gray-400 "
              }  rounded-md  cursor-pointer`}
              onClick={() => setToUpload("tags")}
            >
              Upload Tags
            </p>
          </div>
          {toUpload === "products" && (
            <div className="h-full flex flex-col items-center justify-center">
              {bulkUploadingStage === 1 && (
                <div className="w-[300px] rounded-md shadow-lg border border-gray-300 bg-white p-5 flex flex-col">
                  <p className="text-sm mb-2 w-[100%]">
                    <span className="font-bold text-md text-justify">
                      Step 1:{" "}
                    </span>
                    Please click below if you have already uploaded the
                    'products' folder, which consists of images, to the S3
                    bucket
                  </p>

                  <p className="text-xs mb-4">
                    Note: This step is crucial. Failure to upload the 'product's
                    images' folder may result in a bug in the production system.
                  </p>
                  <button
                    className="text-white bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 font-bold rounded-sm text-md px-5 py-2.5 text-center w-full"
                    onClick={() => setBulkUploadingStage(2)}
                  >
                    Next
                  </button>
                </div>
              )}
              {bulkUploadingStage === 2 && (
                <div className="w-[300px] rounded-md shadow-lg border border-gray-300 bg-white p-5 flex flex-col">
                  <div className="flex flex-row justify-between mb-3 ">
                    <p className="text-sm mb-2 w-[80%]">
                      <span className="font-bold text-md">Step 2: </span>Please
                      upload the basic data sheet related to the products,
                      including names, descriptions, etc.
                    </p>
                    <button
                      onClick={onReset}
                      className="p-2 bg-gray-200 rounded-lg w-[15%] h-10 flex flex-row items-center justify-center"
                      title="Reset"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs mb-4">
                    Note: Please ensure that the format of the field placements
                    is maintained.
                  </p>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => handleFileUpload(e, "basic")}
                  />
                </div>
              )}
              {bulkUploadingStage === 3 && (
                <div className="w-[300px] rounded-md shadow-lg border border-gray-500 bg-white p-5 flex flex-col">
                  <p className="text-md mb-2 font-semibold">
                    Please wait as we validate your basic data sheet...
                  </p>
                  <Image
                    src="/validation1.gif"
                    height={300}
                    width={300}
                    className="rounded-md shadow-md"
                  />
                </div>
              )}
              {bulkUploadingStage === 4 && (
                <div className="w-[300px] rounded-md shadow-lg border border-gray-500 bg-white p-5 flex flex-col">
                  <div className="flex flex-row justify-between mb-3 ">
                    <p className="text-sm mb-2 w-[80%]">
                      <span className="font-bold text-md">Step 3: </span>Please
                      upload the sheet related to the product specifications.
                    </p>
                    <button
                      onClick={onReset}
                      className="p-2 bg-gray-200 rounded-lg w-[15%] h-10 flex flex-row items-center justify-center"
                      title="Reset"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs mb-4">
                    Note: Please ensure that the format of the field placements
                    is maintained.
                  </p>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => handleFileUpload(e, "specs")}
                  />
                </div>
              )}
              {bulkUploadingStage === 5 && (
                <div className="w-[300px] rounded-md shadow-lg border border-gray-500 bg-white p-5 flex flex-col">
                  <p className="text-md mb-2 font-semibold">
                    Please wait as we validate your specifications sheet...
                  </p>
                  <Image
                    src="/validation2.gif"
                    height={300}
                    width={300}
                    className="rounded-md shadow-md"
                  />
                </div>
              )}
              {bulkUploadingStage === 6 && (
                <div className="w-[300px] rounded-md shadow-lg border border-gray-500 bg-white p-5 flex flex-col">
                  <p className="text-md mb-3 font-semibold">
                    Please wait as we upload your data to the database...
                  </p>
                  <Image
                    src="/uploading_bulk.gif"
                    height={300}
                    width={300}
                    className="rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          )}
          {toUpload === "tags" && (
            <div className="flex flex-wrap">
              <div className="w-[300px] rounded-md shadow-lg border border-gray-300 bg-white p-5 flex flex-col mr-4">
                <div className="flex flex-row justify-between mb-3 ">
                  <p className="text-sm mb-2 w-[100%]">
                    <span className="font-bold text-md"> </span>Please upload
                    the general tags sheet with a column - "tag"
                  </p>
                </div>
                <p className="text-xs mb-4">
                  Note: Please ensure that the format of the field placements is
                  maintained.
                </p>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleTagsFileUpload(e)}
                />
              </div>
              <div className="w-[300px] rounded-md shadow-lg border border-gray-300 bg-white p-5 flex flex-col">
                <div className="flex flex-row justify-between mb-3 ">
                  <p className="text-sm mb-2 w-[100%]">
                    <span className="font-bold text-md"></span>Please upload the
                    products-tagged sheet
                  </p>
                </div>
                <p className="text-xs mb-4">
                  Note: Please ensure that the format of the field placements is
                  maintained.
                </p>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleProductsTagFileUpload(e)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default index;
