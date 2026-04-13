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
    <section className="flex p-20 pb-0 justify-between">
      <div className="w-96 flex flex-col gap-4">
        <h2 className="uppercase">Trusted by parents</h2>
        <h1 className="text-4xl font-medium">750 Students</h1>
        <p className="">
          who have witnessed our commitment to quality education, nurturing
          environments, and student success.
        </p>
      </div>
      <div className="h-[500px] w-[700px] overflow-hidden relative">
        <div className="w-full pt-20 absolute left-0 right-0 top-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_bottom,rgba(18,18,18),rgba(18,18,18,0))]"></div>
        <div className="w-full pt-20 absolute left-0 right-0 bottom-0 z-10 bg-[linear-gradient(to_top,rgba(255,255,255),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_top,rgba(18,18,18),rgba(18,18,18,0))]"></div>

        <div
          style={{
            WebkitBoxPack: "center",
            animation: `${moveUp} 25s linear infinite`,
          }}
          className="grid auto-rows-auto grid-cols-2  gap-16 mb-16"
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
          className="grid auto-rows-auto grid-cols-2 gap-16"
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
