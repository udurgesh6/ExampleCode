const CallForSampleModalOpen = ({
  setCallForSampleModalOpen,
  onCallForSampleDetailsSubmission,
  contact,
  setContact,
  addressDetails,
  onAddressTypeClick,
  setAddressDetails,
  loading,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 transition-opacity"
          onClick={() => setCallForSampleModalOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="flex flex-row items-center justify-between p-6 border-b rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900">
              Enter details to order sample
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
              data-modal-hide="defaultModal"
              onClick={() => setCallForSampleModalOpen(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form
            className="p-6 space-y-6 flex flex-col"
            onSubmit={(e) => onCallForSampleDetailsSubmission(e)}
          >
            <div>
              <label
                for="phone"
                className="block mb-2 text-md font-medium text-gray-900 "
              >
                Enter Phone number
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="989208****"
                // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                pattern="[4-9]{1}[0-9]{9}"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength="10"
              />
            </div>
            <p className="block text-md font-medium text-gray-900">
              Deliver to
            </p>

            <div className="flex flex-col pl-3">
              <div className="flex flex-row mb-1">
                <input
                  type="radio"
                  className="mr-2"
                  id="company_address"
                  name="address"
                  checked={addressDetails.addressType === "company"}
                  onChange={() => onAddressTypeClick("company")}
                  // disabled={delivery_at.length > 0}
                  // required={addressDetails.addressType.length < 1}
                  required={true}
                />
                <label htmlFor="company_address">Company address</label>
              </div>
              <textarea
                id="message"
                rows="2"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                placeholder="Your company address here..."
                value={addressDetails.company_address}
                onChange={(e) =>
                  setAddressDetails((addressDetails) => ({
                    ...addressDetails,
                    company_address: e.target.value,
                  }))
                }
                required={addressDetails.addressType === "company"}
              ></textarea>
            </div>
            <h4 className="pl-3 block mb-2 text-md font-medium text-gray-900">
              OR
            </h4>
            <div className="flex flex-col pl-3">
              <div className="flex flex-row mb-1">
                <input
                  type="radio"
                  className="mr-2"
                  id="client_address"
                  name="address"
                  checked={addressDetails.addressType === "client"}
                  // disabled={delivery_at.length > 0}
                  onChange={() => onAddressTypeClick("client")}
                />
                <label htmlFor="client_address">Client address</label>
              </div>
              <textarea
                id="message"
                rows="2"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Your client address here..."
                value={addressDetails.client_address}
                onChange={(e) =>
                  setAddressDetails((addressDetails) => ({
                    ...addressDetails,
                    client_address: e.target.value,
                  }))
                }
                htmlFor="client_address"
                required={addressDetails.addressType === "client"}
              ></textarea>
            </div>
            <div className="flex items-center p-3 space-x-2 border-t border-gray-200 rounded-b">
              <button
                data-modal-hide="defaultModal"
                type="submit"
                className="text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-md text-sm px-5 py-2.5 text-center w-[140px]"
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
                  "Order Sample"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CallForSampleModalOpen;
