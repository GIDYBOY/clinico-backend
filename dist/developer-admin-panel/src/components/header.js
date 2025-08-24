"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const AuthContext_1 = require("@/context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
function Header() {
    const { isAuthenticated, logout } = (0, AuthContext_1.useAuth)();
    return (<header className='w-full shadow-md '>
      <div className=''>
        <div className="bg-gray-100 border-b px-4 py-3 flex justify-between items-center gap-10">
            <lucide_react_1.Settings color="black" className='w-[150px] h-[50px]'/>

            {!isAuthenticated ?
            (<>
              <react_router_dom_1.NavLink to="/" className="text-sm">Sign In</react_router_dom_1.NavLink>
              </>) :
            <div className="">
              <react_router_dom_1.NavLink to='/dashboard' className="p-2 outline rounded-full mx-2">Dashboard</react_router_dom_1.NavLink>
              <button onClick={logout} className='p-2 text-md rounded-full outline'>SignOut</button>
            </div>}
        </div>
      </div>
    </header>);
}
exports.default = Header;
