"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const components_1 = require("@/components");
const AuthContext_1 = require("@/context/AuthContext");
const ProtectedRoute_1 = __importDefault(require("@/routes/ProtectedRoute"));
function App() {
    return (<div className="flex flex-col">
        <react_router_dom_1.BrowserRouter>
            <AuthContext_1.AuthProvider>
                <components_1.Header />
                {/* <main className="flex-1 flex justify-center items-center px-4 py-12"> */}
                    <react_router_dom_1.Routes>
                        <react_router_dom_1.Route path="/" element={<components_1.Signin />}/>
                        <react_router_dom_1.Route path="/dashboard/*" element={<ProtectedRoute_1.default />}/>
                        {/* 404 error */}
                        <react_router_dom_1.Route path="*" element={<div className="flex flex-col justify-center items-center ">
                                <h1 className="text-2xl text-bold mt-10">404</h1>
                                <h4>Page Not Found</h4>
                            </div>}/>
                    </react_router_dom_1.Routes>
                {/* </main> */}
            </AuthContext_1.AuthProvider>
        </react_router_dom_1.BrowserRouter>
      {/* <Footer /> */}
    </div>);
}
exports.default = App;
