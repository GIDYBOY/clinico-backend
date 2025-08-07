import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Signin, Header } from "@/components";
import { AuthProvider } from '@/context/AuthContext';

import Protected from "@/routes/ProtectedRoute"

function App() {
  return (
    <div className="flex flex-col">
        <Router>
            <AuthProvider>
                <Header />
                {/* <main className="flex-1 flex justify-center items-center px-4 py-12"> */}
                    <Routes>
                        <Route path="/" element={<Signin />} />
                        <Route path="/dashboard/*" element={<Protected />} />
                        {/* 404 error */}
                        <Route path="*" element={
                            <div className="flex flex-col justify-center items-center ">
                                <h1 className="text-2xl text-bold mt-10">404</h1>
                                <h4>Page Not Found</h4>
                            </div>
                        } />
                    </Routes>
                {/* </main> */}
            </AuthProvider>
        </Router>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
