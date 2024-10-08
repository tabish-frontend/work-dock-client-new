import type { ChangeEvent, FC } from "react";
import { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import type { Contact } from "src/types";
import { Scrollbar } from "src/utils/scrollbar";
import { useDebouncedCallback } from "use-debounce";
import { contactsApi } from "src/api";

interface ChatComposerRecipientsProps {
  onRecipientAdd?: (contact: Contact) => void;
  onRecipientRemove?: (recipientId: string) => void;
  recipients?: Contact[];
}

export const ChatComposerRecipients: FC<ChatComposerRecipientsProps> = (
  props
) => {
  const {
    onRecipientAdd,
    onRecipientRemove,
    recipients = [],
    ...other
  } = props;
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  const showSearchResults = !!(searchFocused && searchQuery);
  const hasSearchResults = searchResults.length > 0;

  // Debounced version of handleSearchChange
  const debouncedHandleSearchChange = useDebouncedCallback(
    async (value: string) => {
      if (!value) {
        setSearchResults([]);
        return;
      }

      try {
        const contacts = await contactsApi.getContacts({ query: value });

        // Filter already picked recipients
        const recipientIds = recipients.map((recipient) => recipient._id);

        const filtered = contacts.filter(
          (contact) => !recipientIds.includes(contact._id)
        );

        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
      }
    },
    300 // Delay in ms
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchQuery(value); // Update search input value immediately
      debouncedHandleSearchChange(value); // Trigger debounced API call
    },
    [debouncedHandleSearchChange] // Ensure this stays memoized
  );

  const handleSearchClickAway = useCallback((): void => {
    if (showSearchResults) {
      setSearchFocused(false);
    }
  }, [showSearchResults]);

  const handleSearchFocus = useCallback((): void => {
    setSearchFocused(true);
  }, []);

  const handleSearchSelect = useCallback(
    (contact: Contact): void => {
      setSearchQuery("");
      onRecipientAdd?.(contact);
    },
    [onRecipientAdd]
  );

  return (
    <>
      <Box {...other}>
        <Scrollbar>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              p: 2,
            }}
          >
            <ClickAwayListener onClickAway={handleSearchClickAway}>
              <Box sx={{ mr: 1 }}>
                <OutlinedInput
                  fullWidth
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder="Search contacts"
                  ref={searchRef}
                  startAdornment={
                    <InputAdornment position="start">
                      <SvgIcon>
                        <SearchMdIcon />
                      </SvgIcon>
                    </InputAdornment>
                  }
                  sx={{
                    "&.MuiInputBase-root": {
                      height: 40,
                      minWidth: 260,
                    },
                  }}
                  value={searchQuery}
                />
                {showSearchResults && (
                  <Popper
                    anchorEl={searchRef.current}
                    open={searchFocused}
                    placement="bottom-start"
                  >
                    <Paper
                      elevation={16}
                      sx={{
                        borderColor: "divider",
                        borderStyle: "solid",
                        borderWidth: 1,
                        maxWidth: "100%",
                        mt: 1,
                        width: 320,
                      }}
                    >
                      {hasSearchResults ? (
                        <>
                          <Box
                            sx={{
                              px: 2,
                              pt: 2,
                            }}
                          >
                            <Typography
                              color="text.secondary"
                              variant="subtitle2"
                            >
                              Contacts
                            </Typography>
                          </Box>
                          <List>
                            {searchResults.map((contact) => (
                              <ListItemButton
                                key={contact._id}
                                onClick={(): void =>
                                  handleSearchSelect(contact)
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar src={contact.avatar} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={contact.full_name}
                                  primaryTypographyProps={{
                                    noWrap: true,
                                    variant: "subtitle2",
                                  }}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                        </>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography gutterBottom variant="h6">
                            Nothing Found
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            We couldn&apos;t find any matches for &quot;
                            {searchQuery}&quot;. Try checking for typos or using
                            complete words.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Popper>
                )}
              </Box>
            </ClickAwayListener>
            <Typography color="text.secondary" sx={{ mr: 2 }} variant="body2">
              To:
            </Typography>
            <Stack alignItems="center" direction="row" spacing={2}>
              {recipients.map((recipient) => (
                <Chip
                  avatar={<Avatar src={recipient.avatar} />}
                  key={recipient._id}
                  label={recipient.full_name}
                  onDelete={(): void =>
                    onRecipientRemove?.(recipient._id as string)
                  }
                />
              ))}
            </Stack>
          </Box>
        </Scrollbar>
      </Box>
    </>
  );
};

ChatComposerRecipients.propTypes = {
  onRecipientAdd: PropTypes.func,
  onRecipientRemove: PropTypes.func,
  recipients: PropTypes.array,
};
