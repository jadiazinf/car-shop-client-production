import getQuotesByUser from "./by_user";
import { createQuotes } from "./create_quotes";
import getQuote from "./get_quote";
import getQuotesByCompany from "./get_quotes_by_company";
import getServices from "./services";
import { updateQuote } from "./update";

export const useQuoteApiServices = {
  createQuotes,
  getQuotesByCompany,
  getQuote,
  getServices,
  updateQuote,
  getQuotesByUser,
};
