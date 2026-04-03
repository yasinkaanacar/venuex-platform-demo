import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App";
import "./index.css";

posthog.init("phc_4zYXhobdCe3U5MtVSkgGgBFYbl8gBCO4TtCt20YgoBC", {
  api_host: "https://eu.i.posthog.com",
  capture_pageview: false,
  defaults: "2025-01-01",
});

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
);

