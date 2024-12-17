export type actionType = {
  action_key: string;
  path: string;
};

export type columnType = {
  column_key: string;
  column_name: string;
  acitons: actionType[];
};

export type driverType = {
  firstname: string;
  second_name: string;
  lastname: string;
  phone: string;
  extra_phone: string;
  city: string;
  street: string;
  id_number: string;
  driver_car_type_id: string;
};

export type shopType = {
  shop_name: string;
  phone: string;
  extra_phone: string;
  address: string;
};

export type orderType = {
  driver_id: string;
  shop_id: string;
  client_address: string;
  client_phone: string;
  client_extra_phone: string;
  product_price: number;
  delivery_price: number;
  note: string;
};

export type driverPaymentType = {
  price: number;
  note: string;
};

export type spendingType = {
  spending_type_id: number;
  spent_by: string;
  price: number;
  note: string;
};

export type managerType = {
  firstname: string;
  lastname: string;
  phone: string;
  extra_phone: string;
};
