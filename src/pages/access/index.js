import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarAndMainStyles from "../../styles/SidebarAndMain.module.css";
import NewNavbar from "@/components/NewNavbar";

const index = () => {
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    axios.get("../api/getAllUsers").then((resp) => {
      setAllUsers(resp.data);
    });
  }, []);

  const makeAdmin = (user_id) => {
    axios
      .post("../api/makeAdmin", { user_id: user_id })
      .then(() => {
        let temp_allUsers = [...allUsers];
        let indexOfThisUser = temp_allUsers.findIndex(
          (current_user) => current_user.user_id === user_id
        );
        temp_allUsers[indexOfThisUser].access = "admin";
        setAllUsers(temp_allUsers);
        toast("The selected user has been successfully made an admin!");
      })
      .catch(() => {
        toast("Something went wrong while making selected user an admin!");
      });
  };

  return (
    <>
      <NewNavbar />
      <ToastContainer />
      <div className={SidebarAndMainStyles.sidebarAndMain}>
        <div className="w-[100%] mt-3 px-2">
          <div className="relative overflow-x-auto w-full ">
            <table className="w-[100%] text-sm text-left text-gray-500 rounded-t-md">
              <thead className="text-xs text-white uppercase bg-gray-500 ">
                <tr>
                  <th scope="col" className="px-6 py-3 w-[20%]">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 w-[20%]">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 w-[20%]">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 w-[20%]">
                    Access
                  </th>
                  <th scope="col" className="px-6 py-3 w-[20%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((current_user) => (
                  <tr
                    className="bg-gray-200 border-b border-gray-300 "
                    key={current_user.user_id}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 w-[20%]">
                      {current_user.full_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 w-[20%]">
                      {current_user.email}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 w-[20%]">
                      {current_user.contact}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 w-[20%]">
                      {current_user.access === "user"
                        ? "User Level"
                        : "Admin Level"}
                    </td>
                    <td className="px-6 py-4 w-[20%]">
                      {current_user.access === "user" && (
                        <button
                          type="button"
                          className="text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
                          onClick={() => makeAdmin(current_user.user_id)}
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
