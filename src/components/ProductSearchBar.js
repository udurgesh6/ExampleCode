import React, { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const ProductSearchBar = ({
  searchTags,
  setSearchTags,
  clearFilter,
  searchProductsByTags,
  searchProductsByTagId,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const onTagsSearch = debounce(async () => {
    try {
      const response = await axios.get("../api/getTags", {
        params: {
          searchTags,
        },
      });
      console.log(response);
      setSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  }, 300);
  return (
    <form
      className="px-2 pt-4 pb-3 sm:w-[70%] lg:w-[60%] md:w-[60%] xs:w-[90%]"
      autoComplete="off"
      onSubmit={(e) => {
        setSuggestions([]);
        searchProductsByTags(e, searchTags);
      }}
      onMouseLeave={() => setSuggestions([])}
    >
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div class="relative shadow-sm">
        <input
          type="search"
          id="default-search"
          class="block w-full p-4 text-sm text-gray-900 rounded-full bg-gray-100"
          placeholder="Textured grass weave patterns"
          required
          value={searchTags}
          onChange={(e) => {
            setSearchTags(e.target.value);
            onTagsSearch();
          }}
        />
        <div className="flex flex-row absolute right-3.5 bottom-4">
          {searchTags.length > 0 && (
            <button
              type="button"
              class="bg-gray-100 text-black font-bold rounded-lg text-sm "
              title="Clear"
              onClick={() => {
                setSearchTags("");
                clearFilter();
                setSuggestions([]);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 font-bold"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {/* <button
            type="submit"
            class="text-white  bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm px-4 py-2 ml-2"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button> */}
        </div>
        {suggestions.length > 0 && (
          <div
            id="dropdown"
            className="z-30 bg-white divide-y divide-gray-100 rounded-b-lg shadow   absolute max-h-[300px] overflow-auto w-full"
          >
            <ul
              className="text-sm text-gray-700 w-full"
              aria-labelledby="dropdownDefaultButton"
            >
              {suggestions.map((suggestion, pras_index) => (
                <li
                  className="block px-4 py-2 hover:bg-gray-100 flex flex-row items-center cursor-pointer"
                  key={pras_index}
                  onClick={() => {
                    setSearchTags(suggestion.tag_name);
                    setSuggestions([]);
                    searchProductsByTagId(
                      suggestion.tag_name,
                      suggestion.tag_id
                    );
                  }}
                >
                  <p>{suggestion.tag_name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProductSearchBar;
