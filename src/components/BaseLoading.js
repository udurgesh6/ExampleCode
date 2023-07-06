import React from "react";
import Head from "next/head";
const Loading = () => {
  return (
    <>
      <Head>
        <title>boho</title>
        <meta
          name="description"
          content="Helping developers help each other for a better coding experience"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tab_logo.jpg" />
      </Head>
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
    </>
  );
};

export default Loading;
