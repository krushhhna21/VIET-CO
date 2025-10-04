// Import Tailwind styles first
import "./index.css";

// Then import React dependencies
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
