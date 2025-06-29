import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import Sawwah from "../../assets/SawwahLogo.png"
import { tokens } from "../../theme";
import { useAppContext } from "../../context/AppContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
//import PlaceOutinedIcon from "@mui/icons-material/PlaceOutlined";
import MovingOutlinedIcon from "@mui/icons-material/MovingOutlined";
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { isSidebarOpen, toggleSidebar } = useAppContext();
  return (
    <Box
      // width={isSidebarOpen ? "250px" :"80px" }
      height="1200px"
      position="fixed"
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[700]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#263277 !important",
        },
        "& .pro-menu-item.active": {
          color: "#3951d6 !important",
        },
        transition:"width 0.9s ease-in-out"
      }}
    >
      <ProSidebar collapsed={isSidebarOpen}>
        <Menu iconShape="square">
          <MenuItem
            onClick={setSelected}
            icon={
              isSidebarOpen ? (
                <IconButton onClick={() => toggleSidebar(!isSidebarOpen)}>
                  <MenuOutlinedIcon />
                </IconButton>
              ) : undefined
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isSidebarOpen && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                 <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography> 
                <IconButton onClick={() => toggleSidebar(!isSidebarOpen)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isSidebarOpen && (
            <Box mb="20px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={Sawwah}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "8px 0 0 5px" }}
                >
                  Sawwah
                </Typography>
                <Typography variant="h5" sx={{mt:"5px"}} color={colors.greenAccent[500]}>
                  Fancy Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isSidebarOpen ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "10px 0 2px 25px" }}
            >
            Data
            </Typography>
            <Item
              title="Coordinate"
              to="/coordinate"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Buses"
              to="/bus"
              icon={<DBusOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Lines"
              to="/line"
              icon={<MovingOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Cities"
              to="/city"
              icon={<LocationCityOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />


            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "10px 0 2px 25px" }}
            >
              Charts
            </Typography>
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/linech"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
