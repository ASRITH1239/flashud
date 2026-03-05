import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import UploadProducts from './pages/uploadproducts';
import SalesManagement from './pages/SalesManagement';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminManagement from './pages/AdminManagement';
import Coupons from './pages/Coupons';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        // Check active Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminEmail', session.user.email);
            }
            setAuthInitialized(true);
        });

        // Listen for Google Auth redirects or logouts
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminEmail', session.user.email);
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('adminEmail');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!authInitialized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-orange-500 uppercase tracking-[0.2em] text-sm animate-pulse font-medium">Authenticating Portal...</div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen text-white font-sans relative selection:bg-brand-orange selection:text-white">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <Dashboard />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/products" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <Products />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/upload-product" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <UploadProducts />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/sales-management" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <SalesManagement />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <Orders />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/customers" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <Customers />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/categories" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <Categories />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/coupons" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <Coupons />
                            </main>
                        </ProtectedRoute>
                    } />
                    <Route path="/admin-management" element={
                        <ProtectedRoute>
                            <Header />
                            <main className="p-10">
                                <AdminManagement />
                            </main>
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </Router>
    )
}

export default App
