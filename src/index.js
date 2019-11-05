import React, { Suspense, SuspenseList, useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { wrapPromise, randomNumberAndTimeout } from "./Api";

function App() {
  return <SuspenseGrid />;
}

export const Num = ({ resource }) => {
  const n = resource.num.read();
  return <div className="apple">🍎</div>;
};

export const SuspenseGrid = () => {
  let body = [];
  const [n, setN] = useState(500);
  const [cols, setCols] = useState(20);
  const [groupSize, setGroupSize] = useState(3);
  const [innerRevealOrder, setInnerRevealOrder] = useState(false);
  const [outerRevealOrder, setOuterRevealOrder] = useState("");
  const [outerTail, setOuterTail] = useState(undefined);
  const fetchResources = () => {
    const resources = [];
    for (let i = 0; i < n; i++) {
      resources.push(wrapPromise(randomNumberAndTimeout()));
    }
    return resources;
  };
  const [resources, setResources] = useState(() => fetchResources());

  for (let i = 0; i < n / groupSize - groupSize; i++) {
    const group = [];
    for (let k = 0; k < groupSize; k++) {
      const idx = i * groupSize + k;
      group.push(
        <Suspense key={idx} fallback={<div className="sandloader">⌛</div>}>
          <Num resource={{ num: resources[idx] }} />
        </Suspense>
      );
    }
    if (innerRevealOrder) {
      body.push(
        <SuspenseList key={i} revealOrder={innerRevealOrder}>
          {group}
        </SuspenseList>
      );
    } else {
      body.push(...group);
    }
  }

  return (
    <div className="show">
      <h1>🚀 React SuspenseList Example</h1>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("");
          setResources(fetchResources());
        }}
      >
        No Suspense List
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("forwards");
          setResources(fetchResources());
        }}
      >
        Forwards
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("backwards");
          setResources(fetchResources());
        }}
      >
        Backwards
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("together");
          setResources(fetchResources());
        }}
      >
        Together
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("forwards");
          setOuterTail("collapsed");
          setInnerRevealOrder("forwards");
          setResources(fetchResources());
        }}
      >
        Nested Suspense Lists With Collapsed
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, auto)`
        }}
      >
        {outerRevealOrder ? (
          <SuspenseList tail={outerTail} revealOrder={outerRevealOrder}>
            {body}
          </SuspenseList>
        ) : (
          body
        )}
      </div>
    </div>
  );
};

ReactDOM.render(
  <div>
     <App />
  </div>,
  document.getElementById('root')
);