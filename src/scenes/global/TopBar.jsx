import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAppContext } from "../../context/AppContext";

const TopBar = () => {
  const theme = useTheme();
  //const colors = tokens(theme.palette.mode);
  const { isSidebarOpen } = useAppContext();
  const colorMode = useContext(ColorModeContext);
 
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{
        ml: isSidebarOpen ? "80px" : "280px",
        transition: "margin-left 0.3s ease",
      }}
    >
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="7px"
      >
        <Autocomplete
          options={OwnersData}
          getOptionLabel={(op) => op.phoneNumber}
          onChange={(event, selectedOwner) => {
            if (selectedOwner) {
              navigate(`/owner?ownerId=${selectedOwner.id}`);
            }
          }}
          filterOptions={(ops, { inputValue }) =>
            ops.filter((owner) => owner.phoneNumber.includes(inputValue))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search with owner number.."
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: {
                  paddingX: 1.5,
                  paddingY: 0.5,
                },
              }}
              sx={{
                "& input": {
                  color: colors.grey[100],
                },
              }}
            />
          )}
          sx={{
            width: "250px",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
            px: 1,
          }}
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;
