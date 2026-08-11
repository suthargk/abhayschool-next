"use client";
// import Text from "@components/common/Text";
import { keyframes, styled } from "@stitches/react";
import React, { useState } from "react";
import TestinomialItem from "./testinomial-item";
import testinomialsData from "../../../Helper/testinomial";

const moveUp = keyframes({
  "0%": {
    transform: "translateY(0%)",
  },
  "100%": {
    transform: "translateY(-100%)",
  },
});

const Testinomials = () => {
  const [testinomialData, setTestinomialData] = useState(testinomialsData);
  return (
    <section className="flex flex-col lg:flex-row gap-8 lg:gap-10 p-6 sm:p-10 md:p-16 lg:p-20 pb-0 lg:justify-between">
      <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0">
        <h2 className="uppercase">Trusted by parents</h2>
        <h1 className="text-3xl sm:text-4xl font-medium">750 Students</h1>
        <p className="">
          who have witnessed our commitment to quality education, nurturing
          environments, and student success.
        </p>
      </div>
      <div className="h-[360px] sm:h-[420px] lg:h-[500px] w-full lg:w-[700px] overflow-hidden relative">
        <div className="w-full pt-10 sm:pt-16 lg:pt-20 absolute left-0 right-0 top-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_bottom,rgba(18,18,18),rgba(18,18,18,0))]"></div>
        <div className="w-full pt-10 sm:pt-16 lg:pt-20 absolute left-0 right-0 bottom-0 z-10 bg-[linear-gradient(to_top,rgba(255,255,255),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_top,rgba(18,18,18),rgba(18,18,18,0))]"></div>

        <div
          style={{
            WebkitBoxPack: "center",
            animation: `${moveUp} 25s linear infinite`,
          }}
          className="grid auto-rows-auto grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 lg:gap-16 mb-4 sm:mb-8 lg:mb-16"
        >
          {testinomialData.map((testinomial) => {
            return (
              <div key={testinomial.img} className="">
                <TestinomialItem testinomial={testinomial}></TestinomialItem>
              </div>
            );
          })}
        </div>
        <div
          style={{
            WebkitBoxPack: "center",
            animation: `${moveUp} 25s linear infinite`,
          }}
          className="grid auto-rows-auto grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 lg:gap-16"
        >
          {testinomialData.map((testinomial) => {
            return (
              <div key={testinomial.img} className="">
                <TestinomialItem testinomial={testinomial}></TestinomialItem>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testinomials;

{
  /* <Section>
      <SectionContainer>
        <Main>
          <TestinomialsContainer>
            <Cards>
              {testinomialData.map((testinomial) => {
                return (
                  <Card key={testinomial.img}>
                    <TestinomialItem
                      testinomial={testinomial}
                    ></TestinomialItem>
                  </Card>
                );
              })}
            </Cards>
            <Cards>
              {testinomialData.map((testinomial) => {
                return (
                  <Card key={testinomial.img}>
                    <TestinomialItem
                      testinomial={testinomial}
                    ></TestinomialItem>
                  </Card>
                );
              })}
            </Cards>
          </TestinomialsContainer>
        </Main>
      </SectionContainer>
    </Section> */
}
