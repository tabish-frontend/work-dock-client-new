import * as Yup from "yup";

export const common_user_validation = {
  username: Yup.string()
    .required("Username is required")
    .min(3, "Minimum 6 Characters required"),

  full_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name must contain alphabetic")
    .required("Full Name is required")
    .min(3, "Minimum 3 Characters required"),

  email: Yup.string()
    .matches(/^.+@.+\..+$/, "Must be a valid email")
    .required("Email is required"),
};

export const LoginValidation = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string()
    .max(255)
    .required("Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export const ResetPasswordValidation = Yup.object({
  password: Yup.string()
    .required("New Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase(A-Z), One Lowercase(a-z), One Number(0-9) and special case Character(e.g. !@#$%^&*)"
    ),
  password_confirm: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("password")], "Passwords does not match"),
});

export const UserAccountValidation = Yup.object({
  ...common_user_validation,
});

export const UserBankValidation = Yup.object().shape({
  bank_name: Yup.string().required("Bank name is required"),

  account_holder_name: Yup.string()
    .required("Account holder name is required")
    .matches(/^[A-Za-z\s]+$/, "Account holder name must contain alphabetic")
    .min(6, "Name must be at least 3 characters"),

  account_number: Yup.string()
    .required("Account number is required")
    .matches(
      /^[0-9]{14,20}$/,
      "Account number must be between 14 and 20 digits and contain only numbers"
    ),
});

export const employeeValidation = Yup.object().shape({
  ...common_user_validation,
  department: Yup.string().required("Department is required"),
  company: Yup.string().required("Company is required"),
  country: Yup.string().required("Country is required"),
  designation: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Designation must contain alphabetic")
    .required("Designation is required"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Invalid gender")
    .required("Gender is required"),
  role: Yup.string()
    .oneOf(["hr", "employee"], "Invalid role")
    .required("Account Role is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .min(10, "Mobile number must be at least 15 digits")
    .max(15, "Mobile number must be no more than 17 digits"),
});
