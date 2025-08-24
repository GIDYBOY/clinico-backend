"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("@/context/AuthContext");
const components_1 = require("@/components");
const ProtectedRoute = () => {
    const { isAuthenticated, user } = (0, AuthContext_1.useAuth)();
    if (!isAuthenticated && user?.role !== "admin") {
        // Redirect to the sign-in page if not authenticated
        return <react_router_dom_1.Navigate to="/" replace/>;
    }
    return (<react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<components_1.Dashboard />}/>
    </react_router_dom_1.Routes>);
};
exports.default = ProtectedRoute;
