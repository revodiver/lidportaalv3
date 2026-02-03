// Type definitions for the Equipment Lending System

export interface Person {
  Id: number;
  Name: string;
  Surname: string;
  Email?: string;
  IDLid?: string;
  SaldoZuurstof?: number;
  SaldoDuiken?: number;
  'E-Mail'?: string;
  brevet?: string;
  Groep?: string;
  Telefoon?: string;
  GSM?: string;
  Adres?: string;
  Gemeente?: string;
  Postnr?: string;
  'Actief Lid'?: string;
}

export interface EquipmentCategory {
  Id: number;
  Name: string;
  Description?: string;
  SortOrder: number;
  CreatedAt: string;
}

export interface Equipment {
  Id: number;
  CategoryId: number;
  ItemNumber?: string;
  Name: string;
  Brand?: string;
  Size?: string;
  Volume?: string;
  LastInspection?: string;
  NextInspection?: string;
  Model?: string;
  Notes?: string;
  IsAvailable: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Category?: EquipmentCategory;
  CategoryName?: string;  // Added from SQL JOIN
}

export interface Loan {
  Id: number;
  PersonId: number;
  EquipmentId: number;
  BorrowedAt: string;
  ReturnedAt?: string;
  Notes?: string;
  CreatedAt: string;
  Person?: Person;
  Equipment?: Equipment;
}

export interface LoanRequest {
  personId: number;
  equipmentIds: number[];
  notes?: string;
}

export interface ReturnRequest {
  loanIds: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
