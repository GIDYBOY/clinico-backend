"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = require("react-dom/client");
const react_query_1 = require("@tanstack/react-query");
require("./index.css");
const App_1 = __importDefault(require("./App"));
const queryClient = new react_query_1.QueryClient();
(0, client_1.createRoot)(document.getElementById('root')).render(<react_1.StrictMode>
    <react_query_1.QueryClientProvider client={queryClient}>
      <App_1.default />
    </react_query_1.QueryClientProvider>
  </react_1.StrictMode>);
