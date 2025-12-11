import { http, ORGANIZATION_API } from "@/utils";

export const organizationService = {
  contact(data) {
    return http.post(`${ORGANIZATION_API}/contact`, data);
  },
};
