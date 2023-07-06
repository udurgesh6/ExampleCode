import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Fragment,
} from "react";
import Head from "next/head";
import SidebarAndMainStyles from "../../styles/SidebarAndMain.module.css";
import axios from "axios";
import Router from "next/router";
import { AgGridReact } from "ag-grid-react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { selectUserState } from "@/slices/userSlice";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import NewNavbar from "@/components/NewNavbar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TrackStatus = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [currentProductDetails, setCurrentProductDetails] = useState(null);
  const [open, setOpen] = useState(false);

  const onSelectionChanged = useCallback(() => {
    setOpen(true);
    const selectedRows = gridRef.current.api.getSelectedRows();
    setCurrentProductDetails(selectedRows[0]);
  }, []);

  const user_details = useSelector(selectUserState);
  useEffect(() => {
    if (user_details.user_id !== "") {
    } else {
      Router.push({
        pathname: "/auth/authenticate",
        query: { authType: "login" },
      });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`../api/getAllProductsInProjects`)
      .then((resp) => {
        let temp = resp.data.map((rdm) => ({
          "Product Category": rdm.product.category,
          Image: rdm.product.image_link,
          "Product Name": rdm.product.name,
          product_id: rdm.product_id,
          Id: rdm.products_in_project_id,
          "Project Name": rdm.project.name,
          project_id: rdm.project.project_id,
          Address:
            rdm.project.delivery_at === "client"
              ? rdm.project.address
              : rdm.user.company_address,
          Phone: rdm.user.contact,
          Email: rdm.user.email,
          "Customer Name": rdm.user.full_name,
          Status: rdm.status,
          Description: rdm.product.description,
          "Last Updated At": rdm.last_updated_at,
        }));
        setRowData(temp);
      })
      .catch((err) => {
        toast("Something went wrong while getting products status!");
      });
  }, []);

  const [columnDefs] = useState([
    { field: "Id" },
    { field: "Project Name", filter: true },
    { field: "Customer Name", filter: true },
    { field: "Product Name", filter: true },
    { field: "Product Category", filter: true },
    { field: "Status", filter: true },
    { field: "Address", filter: true },
    { field: "Last Updated At", filter: true },
  ]);

  const changeStatusOfAProductInProject = (status_received) => {
    let productsStatusChange = rowData.filter(
      (rd) => rd.project_id === currentProductDetails.project_id
    );
    productsStatusChange = productsStatusChange.map((psc) => psc.Id);
    axios
      .put("../api/changeProductStatus", {
        productsInProject: JSON.stringify(productsStatusChange),
        status: status_received,
      })
      .then(() => {
        axios
          .get(`../api/getAllProductsInProjects`)
          .then((resp) => {
            let temp = resp.data.map((rdm) => ({
              "Product Category": rdm.product.category,
              Image: rdm.product.image_link,
              "Product Name": rdm.product.name,
              product_id: rdm.product_id,
              Id: rdm.products_in_project_id,
              "Project Name": rdm.project.name,
              project_id: rdm.project.project_id,
              Address:
                rdm.project.delivery_at === "client"
                  ? rdm.project.address
                  : rdm.user.company_address,
              Phone: rdm.user.contact,
              Email: rdm.user.email,
              Name: rdm.user.full_name,
              "Customer Name": rdm.user.full_name,
              Status: rdm.status,
              Description: rdm.product.description,
              "Last Updated At": rdm.last_updated_at,
            }));
            setRowData(temp);
            setCurrentProductDetails((currentProductDetails) => ({
              ...currentProductDetails,
              Status: status_received,
            }));
          })
          .catch(() => {
            toast(
              "Something went wrong while getting the updated status of products!"
            );
          });
      })
      .catch(() => {
        toast(
          "Something went wrong while changing the status of the products!"
        );
      });
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
      <ToastContainer />
      <div className={SidebarAndMainStyles.sidebarAndMain}>
        <NewNavbar />
        <div
          className="ag-theme-alpine px-12"
          style={{ height: "100%", width: "100%" }}
        >
          {rowData && (
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              rowSelection={"single"}
              onSelectionChanged={onSelectionChanged}
              onRowClicked={() => setOpen(true)}
            ></AgGridReact>
          )}
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Item Detail
                          </Dialog.Title>
                        </div>
                        {currentProductDetails && (
                          <div className="relative mt-6 flex-1 px-4 sm:px-6 flex-col">
                            <div className="flex flex-row">
                              <Image
                                src={currentProductDetails?.Image}
                                style={{ height: "200px", marginRight: "10px" }}
                                height={200}
                                width={250}
                                className="rounded-md shadow-md"
                              />
                              <div className="flex flex-col justify-between">
                                <div>
                                  <p className="font-semibold text-md">
                                    Track Id
                                  </p>
                                  <p className="text-sm">
                                    {currentProductDetails.Id}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-md">
                                    Product Name
                                  </p>
                                  <p className="text-sm">
                                    {currentProductDetails["Product Name"]}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-md">
                                    Product Category
                                  </p>
                                  <p className="text-sm">
                                    {currentProductDetails["Product Category"]}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="font-semibold text-md mt-4">
                              Product Description
                            </p>
                            <p className="text-sm">
                              {currentProductDetails["Description"]}
                            </p>

                            <div className="flex flex-row justify-between">
                              <div>
                                <p className="font-semibold text-md mt-4">
                                  Project Name
                                </p>
                                <p className="text-sm">
                                  {currentProductDetails["Project Name"]}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold text-md mt-4">
                                  Customer Name
                                </p>
                                <p className="text-sm">
                                  {currentProductDetails["Customer Name"]}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between">
                              <div>
                                <p className="font-semibold text-md mt-4">
                                  Customer Email
                                </p>
                                <p className="text-sm">
                                  {currentProductDetails["Email"]}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold text-md mt-4">
                                  Customer Phone
                                </p>
                                <p className="text-sm">
                                  {currentProductDetails["Phone"]}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-md mt-4">
                                Customer Address
                              </p>
                              <p className="text-sm">
                                {currentProductDetails["Address"]}
                              </p>
                            </div>
                            <div className="flex flex-row mt-4 align-center">
                              <p className="font-semibold text-md p-0 m-0 mr-2 mt-1">
                                Item Status -{" "}
                              </p>
                              <Menu
                                as="div"
                                className="relative inline-block text-left"
                              >
                                <div>
                                  <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {currentProductDetails["Status"]}
                                    <ChevronDownIcon
                                      className="-mr-1 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </Menu.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className=" z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                      {[
                                        "Product Added",
                                        "Address verification in progress",
                                        "Sample Delivery in progress",
                                        "Sample Delivered",
                                        "Quotation Generated",
                                        "Material ordered",
                                        "Installation in progress",
                                        "Installation Completed",
                                      ].map((it) => (
                                        <Menu.Item
                                          onClick={() => {
                                            changeStatusOfAProductInProject(it);
                                          }}
                                          key={it}
                                        >
                                          {({ active }) => (
                                            <a
                                              href="#"
                                              className={classNames(
                                                active
                                                  ? "bg-gray-100 text-gray-900"
                                                  : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                              )}
                                            >
                                              {it}
                                            </a>
                                          )}
                                        </Menu.Item>
                                      ))}
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                            <div>
                              <p className="font-semibold text-md mt-4">
                                Last Updated At
                              </p>
                              <p className="text-sm">
                                {currentProductDetails["Last Updated At"]}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
};

export default TrackStatus;
