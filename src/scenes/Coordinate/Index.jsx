import React, { useState, useCallback, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppContext } from "../../context/AppContext";
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  useTheme,
  Typography,
} from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../components/Header";

import { getAccounts } from "../../Apis/AccountApi";
import {
  getCoordinators,
  AssignCoordinator,
  UnAssignCoordinator,
} from "../../Apis/CoordinatorApi";

// import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
// import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
// import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import SearchIcon from "@mui/icons-material/Search";
const Index = () => {
  // const [accounts, setAccounts] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const { isSidebarOpen } = useAppContext();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [options, setOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [PageNumber, setPageNumber] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  //const [PhoneNumber, setPhoneNumber] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const fetchAccounts = async (searchText) => {
    try {
      const data = await getAccounts({
        PhoneNumber: searchText,
        PageNumber: 1,
        PageSize: 100,
      });
      return data.content || [];
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return [];
    }
  };

  const fetchCoordinators = useCallback(async () => {
    try {
      const data = await getCoordinators({
        PageNumber: PageNumber,
        PageSize: PageSize,
      });
      setCoordinators(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      alert("Couldn't reach any data!");
    }
  }, [PageNumber, PageSize]);

  useEffect(() => {
    fetchCoordinators();
  }, [fetchCoordinators]);

  const handleUnassign = async (id) => {
    try {
      await UnAssignCoordinator(id);
      fetchCoordinators();
    } catch (err) {
      console.error(err);
      alert(err.data.Title);
    }
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "coordinatorId",
      headerName: "Coordinator ID",
      flex: 1,
    },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "unassign",
      headerName: "Unassign",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleUnassign(params.row.id)}>
            <AssignmentLateOutlinedIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px" sx={{ ml: isSidebarOpen ? "110px" : "300px" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
      >
        <Header
          title="Coordinators"
          subtitle="Managing accounts and the information they provide us with"
        />
        <Button
          variant="contained"
          onClick={() => {
            setOpenDialog(true);
          }}
          sx={{
            backgroundColor: colors.greenAccent[600],
            fontWeight: "bold",
            height: "42px",
            "&:hover": {
              backgroundColor: colors.greenAccent[500],
              opacity: 0.9,
            },
          }}
        >
          Assign coordinator
        </Button>
      </Box>
      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[500],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.blueAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={coordinators}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalPages * PageSize}
          page={PageNumber}
          onPageChange={async (newPage) => {
            setPageNumber(newPage);
            await fetchCoordinators();
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            setPageNumber(0);
            await fetchCoordinators();
          }}
          pageSize={PageSize}
          getRowId={(row) => row.id}
          sx={{ mt: 3, height: "70vh" }}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Coordinator</DialogTitle>
        <DialogContent sx={{ minWidth: "400px", mt: 1 }}>
          <Autocomplete
            fullWidth
            freeSolo
            disableClearable
            options={options}
            getOptionLabel={(option) => option.phoneNumber || ""}
            onChange={(event, value) => setSelectedAccount(value)}
            onInputChange={async (event, value) => {
              const results = await fetchAccounts(value);
              setOptions(results);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter phone number"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, background: `${colors.blueAccent[500]}` }}
            disabled={!selectedAccount}
            onClick={async () => {
              try {
                await AssignCoordinator(selectedAccount.id);
                fetchCoordinators();
                setOpenDialog(false);
                setSelectedAccount(null);
                setOptions([]);
              } catch (error) {
                console.error("Failed to assign coordinator", error);
              }
            }}
          >
            Assign
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default Index;
