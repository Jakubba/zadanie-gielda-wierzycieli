import axios from "axios";
import { Debt } from "../types/debt.types";

const BASE_URL = "https://rekrutacja-webhosting-it.krd.pl/api/Recruitment";

export const getTopDebts = async (): Promise<Debt[]> => {
  const { data } = await axios.get<Debt[]>(`${BASE_URL}/GetTopDebts`);
  return data.sort((a: Debt, b: Debt) => a.Name.localeCompare(b.Name));
};

export const searchDebts = async (phrase: string): Promise<Debt[]> => {
  const { data } = await axios.post<Debt[]>(`${BASE_URL}/GetFilteredDebts`, {
    phrase,
  });
  return data;
};
