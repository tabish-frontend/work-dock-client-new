import { Shift } from "./shift";

export interface Employee {
  _id?: string;
  full_name: string;
  bio?: string;
  dob?: Date | null;
  country?: string;
  role?: string;
  gender: string;
  department: string;
  designation: string;
  avatar?: string;
  username: string;
  mobile: string;
  email: string;
  qualification: string;
  company: string;
  account_status: string;
  national_identity_number?: number | undefined;
  shift?: Shift;
  Today_Status?: string;
}
