
import { Link } from "react-router-dom";
import { Button } from '@shared-ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to Sarasota Map Explorer</h1>
        <p className="text-xl text-gray-600 mb-6">Discover beautiful locations around Sarasota, Florida</p>
        <Link to="/map">
          <Button className="bg-blue-600 hover:bg-blue-700">
            View Sarasota Map
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
