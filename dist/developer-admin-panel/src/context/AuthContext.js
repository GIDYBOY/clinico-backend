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
exports.useAuth = exports.AuthProvider = void 0;
// context/AuthContext.tsx
const react_1 = __importStar(require("react"));
const constants_1 = require("@/utils/constants");
const lucide_react_1 = require("lucide-react");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const isAuthenticated = !!user;
    const fetchSession = async () => {
        try {
            const res = await fetch(`${constants_1.baseApiUrl}/auth/me`, {
                credentials: 'include',
            });
            if (!res.ok)
                throw new Error('Session invalid');
            const data = await res.json();
            const normalizedUser = {
                ...data,
                role: data.role.toLowerCase(),
            };
            setUser(normalizedUser);
        }
        catch (err) {
            setUser(null);
            console.warn('No valid session:', err);
        }
        finally {
            setLoading(false);
        }
    };
    console.log('AuthProvider rendered');
    (0, react_1.useEffect)(() => {
        console.log('AuthProvider rendered in effect');
        fetchSession();
    }, []);
    const login = async (userData) => {
        try {
            const response = await fetch(`${constants_1.baseApiUrl}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok)
                throw new Error('Login failed');
            const data = await response.json();
            const normalizedUser = {
                ...data,
                role: data.role.toLowerCase(),
            };
            setUser(normalizedUser);
        }
        catch (error) {
            throw new Error('Login failed. Please check your credentials.');
        }
    };
    const logout = async () => {
        try {
            await fetch(`${constants_1.baseApiUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        }
        catch (err) {
            console.warn('Logout error:', err);
        }
        finally {
            setUser(null);
        }
    };
    const authContextValue = (0, react_1.useMemo)(() => ({
        user,
        isAuthenticated,
        login,
        logout,
        loading, // If you have a loading state for initial auth check
    }), [user, isAuthenticated, loading]);
    // Loading fallback spinner
    if (loading) {
        return (<div className="flex items-center justify-center h-screen">
        <lucide_react_1.Loader2 className="animate-spin w-8 h-8 text-blue-600"/>
        <p className="ml-2 text-blue-600 font-semibold">Loading...</p>
      </div>);
    }
    return (<AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
exports.useAuth = useAuth;
