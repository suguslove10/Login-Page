import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';

interface VendorData {
  storeName: string;
  email: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorData | null>(null);

  useEffect(() => {
    const vendorData = localStorage.getItem('vendor');
    if (!vendorData) {
      navigate('/');
      return;
    }
    setVendor(JSON.parse(vendorData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('vendor');
    navigate('/');
  };

  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Store className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-600 mt-2">You have successfully logged in</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Store Name</p>
            <p className="font-medium text-gray-900">{vendor.storeName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{vendor.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;