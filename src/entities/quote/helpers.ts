import { QuoteStatus } from "./model";

function translateQuoteStatus(status: QuoteStatus) {
  switch (status) {
    case QuoteStatus.APPROVED:
      return "Aprobada";
    case QuoteStatus.PENDING:
      return "Pendiente por respuesta";
    case QuoteStatus.REJECTED:
      return "Rechazada";
  }
}

export const QuoteHelpers = {
  translateQuoteStatus,
};
