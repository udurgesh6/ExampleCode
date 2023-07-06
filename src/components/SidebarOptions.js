import React from "react";

const SidebarOptions = ({ options, setOptions, optionsType }) => {
  const checkOption = (opindex) => {
    let temp__options = [...options];
    temp__options[opindex].checked = !temp__options[opindex].checked;
    setOptions(temp__options);
  };
  return (
    <div className="mb-5">
      <h3 className="mb-2 font-bold text-gray-900 ">{optionsType}</h3>
      <ul className=" text-sm font-medium text-gray-900 border border-gray-200 rounded-lg ">
        {options.map((op, opindex) => (
          <li
            key={op.type}
            className="w-full border-b border-gray-200 rounded-t-lg "
          >
            <div className="flex items-center pl-3">
              <input
                id={op.type}
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
                checked={op.checked}
                onChange={() => checkOption(opindex)}
                disabled={true}
              />
              <label
                htmlFor={op.type}
                className="w-full py-3 ml-2 text-sm font-medium text-gray-900 "
              >
                {op.type}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarOptions;
