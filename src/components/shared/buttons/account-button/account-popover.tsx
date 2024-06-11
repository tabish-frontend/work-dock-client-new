import type { FC } from "react";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import CreditCard01Icon from "@untitled-ui/icons-react/build/esm/CreditCard01";
import Settings04Icon from "@untitled-ui/icons-react/build/esm/Settings04";
import User03Icon from "@untitled-ui/icons-react/build/esm/User03";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/shared/router-link";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/constants";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth";
import { ConfirmationModal } from "../../modals";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { user, signOut } = useAuth<AuthContextType>();
  const [logoutModal, setLogoutModal] = useState(false);

  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      signOut();
      router.replace(paths.auth.login);
      onClose?.();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  }, [router, onClose]);

  const userName = user ? user?.full_name : "";
  const userEmail = user ? user?.email : "";
  const userRole = user ? user?.role : "";

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        disableScrollLock
        onClose={onClose}
        open={!!open}
        PaperProps={{ sx: { width: 230 } }}
        {...other}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">{userName}</Typography>
          <Typography color="text.secondary" variant="body2">
            {userEmail}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          {userRole !== "super-admin" && (
            <ListItemButton
              component={RouterLink}
              href={`${paths.account}?tab=account`}
              onClick={onClose}
              sx={{
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              <ListItemIcon>
                <SvgIcon fontSize="small">
                  <User03Icon />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1">Profile</Typography>}
              />
            </ListItemButton>
          )}
          <ListItemButton
            component={RouterLink}
            href={`${paths.account}?tab=security`}
            onClick={onClose}
            sx={{
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <ListItemIcon>
              <SvgIcon fontSize="small">
                <Settings04Icon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Settings</Typography>}
            />
          </ListItemButton>
          {/* <ListItemButton
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <CreditCard01Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Billing</Typography>}
          />
        </ListItemButton> */}
        </Box>
        <Divider sx={{ my: "0 !important" }} />
        <Box
          sx={{
            display: "flex",
            p: 1,
            justifyContent: "center",
          }}
        >
          <Button
            color="inherit"
            onClick={() => setLogoutModal(true)}
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Popover>

      {logoutModal && (
        <ConfirmationModal
          warning_title={"Log Out"}
          warning_text={"Are you sure you want to logout ?"}
          button_text={"Log Out"}
          modal={logoutModal}
          onCancel={() => {
            setLogoutModal(false);
            onClose?.();
          }}
          onConfirm={async () => {
            handleLogout();
            setLogoutModal(false);
          }}
        />
      )}
    </>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
