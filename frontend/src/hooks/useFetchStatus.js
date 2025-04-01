import { useState } from "react";

const useFetchStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const start = () => {
    setLoading(true);
    setError("");
    setSuccess("");
  };

  const finish = ({ successMessage = "", errorMessage = "" } = {}) => {
    setLoading(false);
    if (successMessage) setSuccess(successMessage);
    if (errorMessage) setError(errorMessage);
  };

  const reset = () => {
    setLoading(false);
    setError("");
    setSuccess("");
  };

  return {
    loading,
    error,
    success,
    start,
    finish,
    reset,
  };
};

export default useFetchStatus;
