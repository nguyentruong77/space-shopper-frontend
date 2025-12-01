import { handleError } from "@/utils";
import { message } from "antd";
import { useRef } from "react";

export const useAction = ({
  service,
  loadingMessage,
  successMessage,
  onSuccess,
}) => {
  const flagActionRef = useRef(false);
  const onAction = async (...args) => {
    if (flagActionRef.current) return;
    flagActionRef.current = true;
    const key = crypto.randomUUID();
    try {
      if (loadingMessage) {
        message.loading({
          key,
          content: loadingMessage,
        });
      }
      await service(...args);
      if (successMessage) {
        message.success({
          key,
          content: successMessage,
        });
      } else {
        message.destroy(key);
      }
      onSuccess?.();
    } catch (error) {
      handleError(error, key);
    }
    flagActionRef.current = false;
  };
  return onAction;
};
