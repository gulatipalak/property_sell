import Button from "../components/Button";

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
            <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
            <Button to="/">Go to Home</Button>
        </div>
    );
};

export default Unauthorized;
