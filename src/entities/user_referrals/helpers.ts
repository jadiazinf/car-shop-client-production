import { UserReferralBy } from "./types";

function translateUserReferralsHelpers(reference: UserReferralBy) {
  switch (reference) {
    case UserReferralBy.FRIEND:
      return "Amigo";
    case UserReferralBy.SOCIAL_MEDIA:
      return "Redes Sociales";
    case UserReferralBy.ADVERTISING:
      return "Publicidad";
    case UserReferralBy.OTHER:
      return "Otro";
    default:
      return "Desconocido";
  }
}

const referralValues = Object.values(UserReferralBy);

export const UserReferralsHelpers = {
  translateUserReferralsHelpers,
  referralValues,
};
