import React from "react";
import { a } from "./imported";

function foo(a: string, b: string) {
  const nest1 = () => {
    return a + b;
  };
  return a + b;
}

function bar(a: string, b: string) {
  return a + b;
}

class MyClass {
  constructor() {}
  method1() {}
  method2() {}
}

() => {
  function inAnonymous() {}
  return "anonymous";
};

const runCallback = (callback: () => void) => {
  callback();
};

const runCallbackWork = () => {
  runCallback(() => {
    console.log("callback");
  });
};
