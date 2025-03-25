import { useState } from "react";

export default function useFetchStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const start = () => {
    setLoading(true);
    setError("");
    setSuccess("");
  };

  const finish = ({ successMessage = "", errorMessage = "" }) => {
    setLoading(false);
    if (errorMessage) setError(errorMessage);
    if (successMessage) setSuccess(successMessage);
  };

  return { loading, error, success, start, finish };
}
