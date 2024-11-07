export type NewServiceInfo = {
  services: { id: number; price: number }[];
  isAllSelected: boolean | { price: number };
}
