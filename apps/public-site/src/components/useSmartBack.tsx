import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const useSmartBack = (fallbackPath = "/map") => {
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const goBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return goBack;
};