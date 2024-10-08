import { TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

interface FullNameFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
  isDisabled?: boolean;
}

export const FullNameField: React.FC<FullNameFieldProps> = ({
  value,
  handleChange,
  handleBlur,
  formikError,
  formikTouched,
  isDisabled = false,
}) => {
  return (
    <TextField
      fullWidth
      required
      label="Full Name"
      disabled={isDisabled}
      name="full_name"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    />
  );
};
