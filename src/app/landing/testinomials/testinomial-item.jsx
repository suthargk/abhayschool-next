import { styled } from "@stitches/react";
import React from "react";

const TestinomialStyle = styled("figure", {});
const TestinomialCaption = styled("figcaption", {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  alignItems: "center",
});

const TestinomialQuotes = styled("blockquote", {});

const TestinomialItem = ({ testinomial }) => {
  return (
    <div className="rounded-2xl p-4  bg-violet-50 dark:bg-zinc-900 dark:shadow-[inset_0_3px_0_0_rgb(39,39,42)] shadow-[inset_0_3px_0_0_rgb(237,233,254,1)]">
      <TestinomialCaption>
        <img src={testinomial.img} width={50} height={50} />
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {testinomial.name}
          </div>
          <div>{testinomial.designation}</div>
        </div>
      </TestinomialCaption>
      <TestinomialQuotes>{testinomial.words}</TestinomialQuotes>
    </div>
  );
};

export default TestinomialItem;
