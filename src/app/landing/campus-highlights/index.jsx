"use client";
import React, { useRef } from "react";
import webpImage from "../../../../public/copter.webp";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Stars from "../../../../public/icons/stars";

const campus_images = [
  {
    id: 1,
    imgUrl: "/images/campus_highlight_1.jpg",
    alt: "campus_highlight_1",
  },
  {
    id: 2,
    imgUrl: "/images/campus_highlight_2.jpg",
    alt: "campus_highlight_2",
  },
  {
    id: 3,
    imgUrl: "/images/campus_highlight_3.jpg",
    alt: "campus_highlight_3",
  },
  {
    id: 4,
    imgUrl: "/images/campus_highlight_7.jpg",
    alt: "campus_highlight_7",
  },
  {
    id: 5,
    imgUrl: "/images/campus_highlight_8.jpg",
    alt: "campus_highlight_8",
  },
];

const campus_lower_images = [
  {
    id: 1,
    imgUrl: "/images/campus_highlight_11.jpg",
    alt: "campus_highlight_11",
  },
  {
    id: 2,
    imgUrl: "/images/campus_highlight_12.jpg",
    alt: "campus_highlight_12",
  },
  {
    id: 5,
    imgUrl: "/images/campus_highlight_5.jpg",
    alt: "campus_highlight_8",
  },
  {
    id: 3,
    imgUrl: "/images/campus_highlight_13.jpg",
    alt: "campus_highlight_13",
  },

  {
    id: 4,
    imgUrl: "/images/campus_highlight_14.jpg",
    alt: "campus_highlight_14",
  },
];

const CampusHighlights = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const imageValue = useTransform(scrollYProgress, [0, 1], ["500%", "-100%"]);

  return (
    <section className="relative">
      <motion.div className="absolute top-0" style={{ translateX: imageValue }}>
        <Image
          width={500}
          height={500}
          src={webpImage}
          alt="a green plant"
          draggable={false}
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <h4 className="text-3xl font-semibold mb-2 text-center">
          <span>Explore Our Campus</span>
        </h4>
        <div className="text-zinc-700 text-center dark:text-zinc-500">
          Experience our campus through vibrant images showcasing its energy,
          spaces, and community.
        </div>
        <Stars />
      </div>

      <div className="flex flex-col gap-20">
        <div className="flex gap-10">
          {campus_images.map((img, index) => {
            let translateYValue;
            let rotate;
            let translateXValue;
            switch (index) {
              case 0:
                translateYValue = 10;
                rotate = 16;
                translateXValue = -5;
                break;
              case 1:
                translateYValue = 94;
                rotate = 10;
                translateXValue = -13;
                break;
              case 2:
                translateYValue = 124;
                rotate = 0;
                translateXValue = 0;
                break;
              case 3:
                translateYValue = 94;
                rotate = -10;
                translateXValue = 13;
                break;
              case 4:
                translateYValue = 10;
                rotate = -16;
                translateXValue = 5;
                break;
            }

            return (
              <div
                style={{
                  transform: `translateY(${translateYValue}px) translateX(${translateXValue}px) rotate(${rotate}deg)`,
                }}
                key={img.id}
                className={`rounded-3xl overflow-hidden w-full h-52 relative bg-violet-50 dark:bg-zinc-900`}
              >
                <Image
                  src={img.imgUrl}
                  width={500}
                  height={500}
                  className="w-full h-full object-center object-cover absolute"
                  alt={img.alt}
                  draggable="false"
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-10">
          {campus_lower_images.map((img, index) => {
            let translateYValue;
            let rotate;
            let translateXValue;
            switch (index) {
              case 0:
                translateYValue = 10;
                rotate = 14;
                translateXValue = -15;
                break;
              case 1:
                translateYValue = 85;
                rotate = 8;
                translateXValue = 0;
                break;
              case 2:
                translateYValue = 160;
                rotate = 0;
                translateXValue = 0;
                break;
              case 3:
                translateYValue = 85;
                rotate = -8;
                translateXValue = 0;
                break;
              case 4:
                translateYValue = 10;
                rotate = -14;
                translateXValue = 15;
                break;
            }

            if (index == 2) {
              return (
                <div
                  key={img.id}
                  style={{
                    transform: `translateY(${translateYValue}px) translateX(${translateXValue}px) rotate(${rotate}deg)`,
                  }}
                  className="min-w-72"
                >
                  <h2 className="text-3xl font-bold  bg-clip-text text-transparent bg-gradient-to-b from-[#df4fca] to-[#ed4492] text-center w-full">
                    Keeping teachers, families, and kids connected
                  </h2>
                </div>
              );
            }

            return (
              <div
                style={{
                  transform: `translateY(${translateYValue}px) translateX(${translateXValue}px) rotate(${rotate}deg)`,
                }}
                key={img.id}
                className={`rounded-3xl overflow-hidden w-full h-52 relative bg-violet-50 dark:bg-zinc-900 scale-150`}
              >
                <Image
                  src={img.imgUrl}
                  width={500}
                  height={500}
                  className="w-full h-full object-center object-cover absolute"
                  alt={img.alt}
                  draggable="false"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampusHighlights;
