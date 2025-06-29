import { useState, useEffect, useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
//import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
// import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Box,
  Typography,
  useTheme,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
} from "@mui/material";
import { useAppContext } from "../../context/AppContext";
import { addBus, deleteData, getBuses } from "../../Apis/BusApi";
import { getCities, addCity } from "../../Apis/CityApi";
import { getLines, addLine } from "../../Apis/LineApi";
import { getAccounts } from "../../Apis/AccountApi";
import * as Yup from "yup";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useFormik } from "formik";
const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isSidebarOpen } = useAppContext();

  const [buses, setBuses] = useState([]);

  const [cities, setCities] = useState([]);
  const [citiesFrom, setCitiesFrom] = useState([]);
  const [citiesTo, setCitiesTo] = useState([]);
  // const [lines, setLines] = useState([]);

  const [linedes, setLinedes] = useState("");
  const [newCityNameArabic, setNewCityNameArabic] = useState("");
  const [newCityNameEnglish, setNewCityNameEnglish] = useState("");
  const [newCityParentId, setNewCityParentId] = useState(null);

  const [newLineCost, setNewLineCost] = useState(0);
  // const [newLineFrom, setNewLineFrom] = useState("");
  // const [newLineTo, setNewLineTo] = useState("");
  //const [pendingCityField, setPendingCityField] = useState("");
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [openLineDialog, setOpenLineDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  //const formikRef = useRef();

  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filterType, setFilterType] = useState(0);
  const [Plate, setPlate] = useState("");
  const [OwneId, setOwneId] = useState(null);
  //const [editBus, setEditBus] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [optionsAdd, setOptionsAdd] = useState([]);
  const [inputOwnerPhone, setInputOwnerPhone] = useState(null);
  const [plateInput, setPlateInput] = useState("");

  const plateOptions = useMemo(() => {
    const allPlates = buses.map((bus) => bus.plate);
    return [...new Set(allPlates)];
  }, [buses]);

  const fetchAccounts = async (searchText) => {
    try {
      const data = await getAccounts({
        PhoneNumber: searchText,
        PageNumber: 1,
        PageSize: 10,
      });
      return data.content;
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchCities = useCallback(async (searchText) => {
    try {
      const data = await getCities({
        PageNumber: 1,
        PageSize: 10,
        Name: searchText,
      });
      return data.content;
    } catch (err) {
      console.error(err);
      alert(`${err.response.Title}`);
    }
  }, []);

  const fetchLines = useCallback(async (searchFrom, searchTo) => {
    try {
      const data = await getLines({
        PageNumber: 1,
        PageSize: 10,
        CityToId: searchTo,
        CityFromId: searchFrom,
      });
      console.log(data.content);
      return data.content;
    } catch (err) {
      console.error(err);
      alert("Can't fetch Lines");
    }
  }, []);

  const fetchBuses = useCallback(async () => {
    try {
      const data = await getBuses({
        Filter: filterType,
        Plate: Plate,
        OwneId: OwneId,
        PageNumber: pageNumber + 1,
        PageSize: pageSize,
      });
      setBuses(data.content);
      console.log(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      alert("Can't fetch Buses");
    }
  }, [filterType, Plate, OwneId, pageNumber, pageSize]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  // useEffect(() => {
  //   fetchLines();
  // }, [fetchLines]);

  // useEffect(() => {
  //   fetchCities();
  // }, [fetchCities]);

  const typeEnum = {
    0: "",
    1: "Bolman",
    2: "Van",
    3: "Servece",
  };
  const reverseTypeEnum = {
    Bolman: 0,
    Van: 1,
    Servece: 2,
  };

  const typeEnumf = {
    0: "Bolman",
    1: "Van",
    2: "Servece",
  };
  // const findCityId = (name) => {
  //   const c = cities.find(
  //     (c) => c?.englishName.toLowerCase().trim() === name.toLowerCase().trim()
  //   )?.id;
  //   console.log(c + "c");
  //   return c;
  // };

  const handleAddCity = async () => {
    try {
      await addCity({
        arabicName: newCityNameArabic,
        englishName: newCityNameEnglish,
        cityId: newCityParentId,
      });

      //formik.setFieldValue()
      const addedCity = await fetchCities(newCityNameEnglish);
      console.log(addedCity);
      formik.setFieldValue(linedes, addedCity?.[0]);
      setOpenCityDialog(false);
      setNewCityNameArabic("");
      setNewCityNameEnglish("");
      setNewCityParentId(null);
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
      alert("Failed to add city");
    }
  };

  const handleAddLine = async () => {
    try {
      const fromId = formik.values.from.id;
      const toId = formik.values.to.id;
      const cost = Number(newLineCost);
      console.log(fromId, toId, cost);
      const addedLine = await addLine({
        fromId: fromId,
        toId: toId,
        cost: cost,
      });

      formik.setFieldValue("lineId", addedLine[0]?.id);
      await fetchLines(fromId, toId);
      formik.handleSubmit();
      setOpenLineDialog(false);
      setNewLineCost(0);
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
      alert("Failed to add line");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log(values.from);
    console.log(values.to);

    const plate = String(values.plate);
    const color = String(values.color);
    const accountId = Number(values.ownerNumber);
    const typeNumber = Number(values.type);

    if (!accountId) {
      resetForm();
      setOpenDialog(true);
      return;
    }

    let fromId = null;
    if (typeof values.from === "object" && values.from !== null) {
      fromId = values.from.id;
    } else if (typeof values.from === "string") {
      setLinedes("from");
      setNewCityNameEnglish(values.from);
      setOpenCityDialog(true);
      return;
    }

    let toId = null;
    if (typeof values.to === "object" && values.to !== null) {
      toId = values.to.id;
    } else if (typeof values.to === "string") {
      setLinedes("to");
      setNewCityNameEnglish(values.to);
      setOpenCityDialog(true);
      return;
    }

    const lines = await fetchLines(fromId, toId);
    const line = lines?.[0];
    const lineId = line?.id;

    if (!lineId) {
      setOpenLineDialog(true);
      return;
    }

    const busPayload = {
      plate: plate,
      color: color,
      lineId: lineId,
      type: typeNumber,
      accountId: accountId,
    };

    console.log("Bus Payload:", busPayload);

    try {
      await addBus(busPayload);
      resetForm();
      fetchBuses();
      setOpenDialog(false);
    } catch (error) {
      console.log("Error submitting bus:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      plate: "",
      color: "",
      from: null,
      to: null,
      type: "",
      ownerNumber: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      plate: Yup.string().required("Plate is required"),
      color: Yup.string().required("Color is required"),
      from: Yup.mixed().required("From is required"),
      to: Yup.mixed().required("To is required"),
      type: Yup.string().required("Type is required"),
      ownerNumber: Yup.string().required("Owner number is required"),
    }),
    onSubmit: handleSubmit,
  });

  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      fetchBuses();
    } catch (error) {
      console.error(error);
      alert("Unable to delete");
    }
  };

  const columns = [
    { field: "busId", headerName: "BUS ID" },
    { field: "ownerId", headerName: "OWNER ID" },
    {
      field: "driverId",
      headerName: "DRIVER ID",
      renderCell: (params) => {
        if (params.value) {
          return <Box>{params.value}</Box>;
        } else return <Box>-</Box>;
      },
    },
    {
      field: "driverName",
      headerName: "Driver name",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return <Box>{params.value}</Box>;
        } else return <Box>-</Box>;
      },
    },
    {
      field: "plate",
      headerName: "Plate",
      flex: 1,
    },
    {
      field: "color",
      headerName: "Color",
      flex: 1,
    },
    {
      field: "from",
      headerName: "From",
      flex: 1,
      renderCell: (params) => <Box>{params.formattedValue.name}</Box>,
    },
    {
      field: "to",
      headerName: "To",
      flex: 1,
      renderCell: (params) => <Box>{params.formattedValue.name}</Box>,
    },

    {
      field: "type",
      headerName: "Bus Type",
      flex: 1,
      renderCell: (params) => <Box>{typeEnumf[params.value]}</Box>,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleDelete(params.row.busId)}>
            <DeleteOutlinedIcon sx={{ color: `${colors.redAccent[400]}` }} />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <Box
      m="20px"
      sx={{
        ml: isSidebarOpen ? "110px" : "300px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
      >
        <Header title="Buses" subtitle="Managing Buses information" />
        <Button
          variant="contained"
          onClick={() => {
            setOpenDialog(true);
            formik.resetForm();
          }}
          sx={{
            mb: 3,
            backgroundColor: colors.greenAccent[600],
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: colors.greenAccent[500],
              opacity: 0.9,
            },
          }}
        >
          Add Bus
        </Button>
      </Box>
      <Box display="flex" gap={3}>
        <Box
          display="flex"
          alignItems="center"
          backgroundColor={colors.primary[500]}
          borderRadius="10px"
          px={1}
          py={0.5}
        >
          <Autocomplete
            freeSolo
            options={Object.values(typeEnum)}
            value={typeEnum[filterType]}
            onChange={(event, newValue) => {
              const foundEntry = Object.entries(typeEnum).find(
                ([, label]) => label === newValue
              );
              setFilterType(foundEntry ? parseInt(foundEntry[0]) : 0);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search with bus type.."
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    color: colors.grey[100],
                    px: 1.5,
                    py: 0.5,
                  },
                }}
                sx={{
                  width: "250px",
                  "& input": {
                    color: colors.grey[100],
                  },
                }}
              />
            )}
            sx={{
              flexGrow: 1,
            }}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          backgroundColor={colors.primary[500]}
          borderRadius="10px"
          px={1}
          py={0.5}
        >
          <Autocomplete
            fullWidth
            freeSolo
            disableClearable
            options={plateOptions.filter((option) =>
              option.toLowerCase().includes(plateInput.toLowerCase())
            )}
            inputValue={plateInput}
            onInputChange={(event, newInput) => setPlateInput(newInput)}
            onChange={(event, selectedValue) => {
              if (plateOptions.includes(selectedValue)) {
                setPlate(selectedValue);
              } else {
                setPlate("");
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by bus plate ..."
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    color: colors.grey[100],
                    px: 1.5,
                    py: 0.5,
                  },
                }}
                sx={{
                  width: "250px",
                  "& input": {
                    color: colors.grey[100],
                  },
                }}
              />
            )}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          backgroundColor={colors.primary[500]}
          borderRadius="10px"
          px={1}
          py={0.5}
        >
          <Autocomplete
            fullWidth
            freeSolo
            disableClearable
            options={options}
            getOptionLabel={(option) =>
              typeof option === "object" ? option.phoneNumber || "" : ""
            }
            onChange={(event, value) => {
              setSelectedAccount(value);
              setOwneId(selectedAccount?.id || null);
            }}
            onInputChange={async (event, value) => {
              const results = await fetchAccounts(value);
              setOptions(results);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search with owner number.."
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    color: colors.grey[100],
                    px: 1.5,
                    py: 0.5,
                  },
                }}
                sx={{
                  width: "250px",
                  "& input": {
                    color: colors.grey[100],
                  },
                }}
              />
            )}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          rows={buses}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalPages * pageSize}
          page={pageNumber}
          onPageChange={async (newPage) => {
            setPageNumber(newPage);
            await fetchBuses();
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            setPageNumber(0);
            await fetchBuses();
          }}
          pageSize={pageSize}
          getRowId={(row) => row.busId}
          sx={{ mt: 3, height: "70vh" }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <DialogTitle>Add New Bus</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Plate"
              name="plate"
              fullWidth
              margin="normal"
              value={formik.values.plate}
              onChange={formik.handleChange}
              error={formik.touched.plate && Boolean(formik.errors.plate)}
              helperText={formik.touched.plate && formik.errors.plate}
            />

            <TextField
              label="Color"
              name="color"
              fullWidth
              margin="normal"
              value={formik.values.color}
              onChange={formik.handleChange}
              error={formik.touched.color && Boolean(formik.errors.color)}
              helperText={formik.touched.color && formik.errors.color}
            />
            <Autocomplete
              freeSolo
              blurOnSelect
              options={citiesFrom}
              value={formik.values.from}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                if (option && typeof option === "object")
                  return option.englishName || "";
                return "";
              }}
              onChange={(event, value) => {
                formik.setFieldValue("from", value);
                setCitiesFrom([]);
              }}
              onInputChange={async (event, value) => {
                formik.setFieldValue("from", value);

                const results = await fetchCities(value);
                setCitiesFrom(
                  Array.isArray(results) ? results.filter(Boolean) : []
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  margin="normal"
                  fullWidth
                  error={formik.touched.from && Boolean(formik.errors.from)}
                  helperText={formik.touched.from && formik.errors.from}
                />
              )}
            />
            <Autocomplete
              freeSolo
              blurOnSelect
              options={citiesTo}
              value={formik.values.to}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                if (option && typeof option === "object")
                  return option.englishName || "";
                return "";
              }}
              onChange={(event, value) => {
                formik.setFieldValue("to", value);
                setCitiesTo([]);
              }}
              onInputChange={async (event, value) => {
                formik.setFieldValue("to", value);

                const results = await fetchCities(value);
                setCitiesTo(
                  Array.isArray(results) ? results.filter(Boolean) : []
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="to"
                  margin="normal"
                  fullWidth
                  error={formik.touched.to && Boolean(formik.errors.to)}
                  helperText={formik.touched.to && formik.errors.to}
                />
              )}
            />
            <Autocomplete
              fullWidth
              freeSolo
              disableClearable
              options={optionsAdd}
              value={
                optionsAdd.find(
                  (opt) => opt.id === formik.values.ownerNumber
                ) || null
              }
              getOptionLabel={(option) =>
                typeof option === "object"
                  ? `${option.phoneNumber} - ${option.name || ""}`
                  : inputOwnerPhone
              }
              onChange={(event, value) => {
                if (value && typeof value === "object") {
                  formik.setFieldValue("ownerNumber", value.id);
                } else {
                  formik.setFieldValue("ownerNumber", "");
                }
              }}
              onInputChange={async (event, value) => {
                setInputOwnerPhone(value);
                const results = await fetchAccounts(value);
                console.log(results);
                setOptionsAdd(results || []);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Owner phone number"
                  margin="normal"
                  fullWidth
                  name="ownerNumber"
                  error={
                    formik.touched.ownerNumber &&
                    Boolean(formik.errors.ownerNumber)
                  }
                  helperText={
                    formik.touched.ownerNumber && formik.errors.ownerNumber
                  }
                />
              )}
            />

            <Autocomplete
              freeSolo
              blurOnSelect
              options={Object.values(typeEnum)}
              value={typeEnum[formik.values.type] || ""}
              onChange={(e, value) => {
                const num = reverseTypeEnum[value];
                formik.setFieldValue("type", num);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type"
                  margin="normal"
                  fullWidth
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  helperText={formik.touched.type && formik.errors.type}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                formik.resetForm();
              }}
              sx={{ color: `${colors.blueAccent[400]}` }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: `${colors.blueAccent[400]}` }}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openLineDialog}>
        <DialogTitle>Add New Line</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            No line exists between the two cities you entered. Add line
            manually?
          </Typography>

          <TextField
            label="Cost"
            type="number"
            fullWidth
            value={newLineCost}
            onChange={(e) => {
              setNewLineCost(e.target.value);
            }}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: `${colors.blueAccent[400]}` }}
            onClick={() => {
              setOpenLineDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: `${colors.blueAccent[400]}` }}
            onClick={handleAddLine}
            disabled={!newLineCost || isNaN(parseFloat(newLineCost))}
          >
            Add Line and submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCityDialog}
        onClose={() => {
          setOpenCityDialog(false);
        }}
      >
        <DialogTitle>Add New City</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="City Name English"
            fullWidth
            variant="outlined"
            value={newCityNameEnglish}
            onChange={(e) => setNewCityNameEnglish(e.target.value)}
            //onChange={formik.handleChange}
          />

          <TextField
            autoFocus
            margin="dense"
            label="City Name Arabic"
            fullWidth
            variant="outlined"
            value={newCityNameArabic}
            onChange={(e) => setNewCityNameArabic(e.target.value)}
            //onChange={formik.handleChange}
          />
          <Autocomplete
            options={cities}
            blurOnSelect
            getOptionLabel={(c) =>
              typeof c === "object" && c !== null ? c.englishName || "" : ""
            }
            // value={cities.find((c) => c.id === newCityParentId) || null}
            onChange={(e, val) => {
              setNewCityParentId(val?.id || null);
              setCities([]);
            }}
            onInputChange={async (e, val) => {
              const results = await fetchCities(val);
              setCities(Array.isArray(results) ? results.filter(Boolean) : []);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City Parent"
                fullWidth
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCityDialog(false)}
            sx={{ color: `${colors.blueAccent[400]}` }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCity}
            type="submit"
            variant="contained"
            sx={{ background: `${colors.blueAccent[400]}` }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Index;
