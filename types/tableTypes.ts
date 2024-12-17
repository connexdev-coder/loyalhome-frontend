export type actionType = {
  action_key: string;
  path: string;
};

export type columnType = {
  column_key: string;
  column_name: string;
  acitons: actionType[];
};

export type managerType = {
  name: string;
  username: string;
};

export type roomServiceType = {
  room_service_name: string;
  room_service_price: number;
};

export type roomFeatureType = {
  room_feature_name: string;
};

export type departmentType = {
  department_name: string;
};

export type companyType = {
  company_name: string;
};

export type productType = {
  unit_id: number;
  name: string;
  category: string;
};

export type roomType = {
  room_number: string;
  room_type: string;
  hour_price: number;
  day_price: number;
  features: [];
};

export type clientType = {
  firstname: string;
  second_name: string;
  lastname: string;
  phone: string;
  extra_phone: string;
  city: string;
  address: string;
  gender: string;
  images: [];
};

export type employeeType = {
  department_id: number;
  salary: number;
  nationality: string;
  graduate: string;
  firstname: string;
  second_name: string;
  lastname: string;
  phone: string;
  extra_phone: string;
  friend_phone: string;
  city: string;
  address: string;
  gender: string;
  married: boolean;
  birthday: null;
  images: [];
};

export type bookingType = {
  room_price: number;
  service_price: number;
  room_id: number;
  client_id: number;
  from: any;
  to: any;
  note: any;
  services: [];
};

export type employeeInvoiceType = {
  amount_paid: number;
  note: string;
};

export type spendingType = {
  spend_price: number;
  spend_type: string;
  spend_by: string;
  getter: string;
  note: string;
};

export type importInvoiceType = {
  company_id: number;
  invoice_number: number;
  is_cash: boolean;
  image: string;
};

export type importInvoiceProductType = {
  product_id: number;
  import_invoice_id: number;
  quantity: number;
  box_quantity: number;
  price: number;
  price_box: number;
};

export type exportType = {
  product_id: number;
  department_id: number;
  quantity: number;
  getter: string;
  note: string;
};

export type wasteType = {
  product_id: number;
  quantity: number;
};

export type companyPaymentType = {
  company_id: number;
  amount_paid: number;
  image: string;
  note: string;
};

export type qasaTransactionType = {
  amount: number;
  getter: string;
  setter: string;
  invoice_img: string;
  note: string;
  is_deposit: boolean;
};
