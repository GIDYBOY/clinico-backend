"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignIn;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Button_1 = require("@/ui/Button");
const Input_1 = require("@/ui/Input");
// import { baseApiUrl } from "@/utils/constants";
const AuthContext_1 = require("@/context/AuthContext");
function SignIn() {
    const { login } = (0, AuthContext_1.useAuth)();
    const [identifier, setIdentifier] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [errors, setErrors] = (0, react_1.useState)({});
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSignIn = async () => {
        const newErrors = {};
        if (!identifier.trim())
            newErrors.email = "Email is required.";
        if (!password.trim())
            newErrors.password = "Password is required.";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            await login({ email: identifier, password });
            navigate("/dashboard");
        }
        catch (err) {
            console.error("Login error:", err);
            setErrors({ general: "Login failed. Please check your credentials and try again." });
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gray-200 relative z-10">
      <div className="bg-white shadow-lg rounded-md px-6 py-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-800">Clinico</h1>
        </div>

        <h2 className="text-lg font-semibold mb-4">Sign In to Clinico</h2>

        {errors.general && (<div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {errors.general}
          </div>)}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email address</label>
          <Input_1.Input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full" placeholder="e.g. user@example.com"/>
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <Input_1.Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" placeholder="Enter password"/>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}

          <div className="flex items-center mt-2">
            <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2"/>
            <label className="text-sm">Show Password</label>
          </div>
        </div>

        <div className="mt-2 mb-4 flex justify-between items-center">
          <Button_1.Button className="text-sm text-teal-500 hover:underline" onClick={() => navigate("/forgot-password")} variant="link">
            Forgot Password
          </Button_1.Button>
          <Button_1.Button onClick={handleSignIn} className="bg-blue-800 text-white px-6 py-1 text-sm hover:bg-blue-700">
            SIGN IN
          </Button_1.Button>
        </div>

        <hr className="my-4"/>

      </div>
    </div>);
}
