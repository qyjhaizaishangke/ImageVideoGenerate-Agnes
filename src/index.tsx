import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root div not found");
}

render(() => <Router />, root);
