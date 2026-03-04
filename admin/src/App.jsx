import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-fashion-black text-white">
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
