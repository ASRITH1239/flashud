import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Categories from './pages/Categories';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-fashion-black text-white">
                <Header />
                <main className="p-10">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/categories" element={<Categories />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
