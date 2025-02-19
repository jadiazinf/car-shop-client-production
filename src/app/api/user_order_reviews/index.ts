import { getCompanyClaims } from "./company_claims";
import { createReview } from "./create";
import { getReview } from "./get_review";
import { getCompanyRatings } from "./company_ratings";

export const useUserOrderReviewsApiServices = {
  getReview,
  createReview,
  getCompanyClaims,
  getCompanyRatings,
};
