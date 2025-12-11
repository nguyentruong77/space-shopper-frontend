import { REVIEW_API } from "@/config/api";
import { http } from "@/utils";

export const reviewService = {
  getReview(productId) {
    return http.get(`${REVIEW_API}/${productId}`);
  },
  addReview(productId, data) {
    return http.post(`${REVIEW_API}/${productId}`, data);
  },
};
