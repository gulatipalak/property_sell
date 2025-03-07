import { confirmable, ConfirmDialog } from "react-confirm";

interface Props {
  confirmation?: string;
  show?: boolean;
  proceed?: (answer: boolean) => void;
}

const ConfirmationDialog: ConfirmDialog<Props, boolean> = ({ show, proceed = () => {}, confirmation }) => {
  if (!show) return null; // Hide modal if not needed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full transform scale-100 transition-all">
        <p className="text-lg font-semibold text-gray-900">{confirmation}</p>
        <p className="text-red-600 font-medium mt-2">This action cannot be undone!</p>

        <div className="mt-5 flex justify-center gap-4">
          <button
            onClick={() => proceed(false)}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => proceed(true)}
            className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default confirmable(ConfirmationDialog);
