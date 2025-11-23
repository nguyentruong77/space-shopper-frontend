import { message } from "antd";

export const handleError = (error) => {
  console.error(error);
  if (error?.response?.data?.message || error?.message) {
    message.error(error?.response?.data?.message || error?.message);
  }
};
