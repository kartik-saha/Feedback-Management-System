import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Toast.css'; // Custom styling for toast position and theme

// Toast helper functions
export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

// Reusable toast container
export const ToastWrapper = () => (
  <ToastContainer
    position="top-right"
    autoClose={2000}
    closeOnClick
    pauseOnHover
    draggable
    className="custom-toast-container"
    toastClassName="custom-toast"
    progressClassName="custom-toast-progress"
  />
);
