import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import MascotBox from "/MascotBox.png";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="relative w-64 h-64 mx-auto">
          <img
            src={MascotBox}
            alt="404 Mascot"
            className="w-full h-full object-contain animate-bounce-slow"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-paytone text-capybara-blue">404</h1>
          <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600">
            Oops! It seems like the page you are looking for has been moved or
            doesn't exist.
          </p>
        </div>

        <Link to="/">
          <Button className="bubble-btn-primary mt-8 px-8 py-6 text-lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
