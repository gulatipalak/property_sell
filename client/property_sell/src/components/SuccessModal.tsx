interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
        <h2 className="text-2xl font-bold text-blue-800">Welcome</h2>
        <p className="mt-2 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-10 py-2 bg-blue-800 text-white rounded-sm hover:bg-blue-900 transition"
        >
          Got It
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
