import React from "react";

import Image from "next/image";
import webpImage from "../../../../public/peppa_hero.png";
import peppaPigImage from "../../../../public/peppa_pig.png";
import peppaPigFairyImage from "../../../../public/peppa_fairy.png";
import peppaPigPartyImage from "../../../../public/peppa_party.png";

const Hero = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="flex flex-col text-center pt-24">
        <span className="uppercase text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#555]/70 to-[#000] dark:from-[#555]/20 dark:to-[#fff]">
          Shri Abhay Nobles Senior Secondary School
        </span>
        <span className="text-6xl font-semibold ">
          Excellence in{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9] ">
            Education
          </span>
        </span>
        <span className="text-6xl py-2 text-violet-500 font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#df4fca] to-[#ed4492] ">
          Passion for Learning.
        </span>
      </h1>
      <div className="flex">
        {/* <Image
          src={peppaPigPartyImage}
          alt="kids"
          draggable={false}
          width={300}
          height={300}
          className="self-end"
        /> */}
        <Image
          src={webpImage}
          alt="kids"
          draggable={false}
          width={500}
          height={500}
        />
        <div className="flex flex-col justify-between">
          <Image
            src={peppaPigFairyImage}
            alt="kids"
            className="self-end"
            draggable={false}
            width={200}
            height={200}
          />
          <Image
            src={peppaPigImage}
            alt="kids"
            draggable={false}
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
