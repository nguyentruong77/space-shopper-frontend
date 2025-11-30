import { message } from "antd";

export const handleError = (error, key) => {
  console.error(error);
  if (error?.response?.data?.message || error?.message) {
    message.error({
      key,
      content: error?.response?.data?.message || error?.message,
    });
  }
};
