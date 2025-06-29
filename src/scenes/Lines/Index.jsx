import { useState, useCallback, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getCities, addCity } from "../../Apis/CityApi";
import { getLines, deleteData, addLine, updateLine } from "../../Apis/LineApi";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Alert,
  Box,
  Switch,
  FormControlLabel,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { useAppContext } from "../../context/AppContext";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isSidebarOpen } = useAppContext();
  const [lines, setLines] = useState([]);
  const [cities, setCities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editLine, setEditLine] = useState(null);
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [newCityNameArabic, setNewCityNameArabic] = useState("");
  const [newCityNameEnglish, setNewCityNameEnglish] = useState("");
  const [newCityParentId, setNewCityParentId] = useState(null);
  // const [pendingCityField, setPendingCityField] = useState("");
  // const formikRef = useRef();

  const [duplicateError, setDuplicatedError] = useState(false);
  const [logicError, setLogicError] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [cityFromId, setCityFromId] = useState(null);
  const [cityToId, setCityToId] = useState(null);

  const fetchCities = useCallback(async () => {
    try {
      const data = await getCities({ PageNumber: 1, PageSize: 100 });
      setCities(data.content);
    } catch (err) {
      console.error(err);
      alert("Can't fetch cities");
    }
  }, []);

  const fetchLines = useCallback(async () => {
    try {
      const data = await getLines({
        CityFromId: cityFromId,
        CityToId: cityToId,
        PageNumber: pageNumber + 1,
        PageSize: pageSize,
      });
      setLines(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      alert("Can't fetch lines");
    }
  }, [cityFromId, cityToId, pageNumber, pageSize]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  const handleAddCity = async () => {
    try {
      await addCity({
        arabicName: newCityNameArabic,
        englishName: newCityNameEnglish,
        cityId: newCityParentId,
      });
      await fetchCities();
      setOpenCityDialog(false);
      setNewCityNameArabic("");
      setNewCityNameEnglish("");
      setNewCityParentId(null);
      //setPendingCityField("");
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
      alert("Failed to add city");
    }
  };

  const filter = createFilterOptions();

  const handleCityAutocompleteChange = (fieldName, value) => {
    if (typeof value === "string" && value.startsWith("Add new city:")) {
      ///setPendingCityField(fieldName);
      setOpenDialog(false);
      setOpenCityDialog(true);
    } else {
      formik.setFieldValue(fieldName, value?.id || null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "cityFrom",
      headerName: "From",
      flex: 1,
    },
    {
      field: "cityTo",
      headerName: "To",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditOutlinedIcon sx={{ color: colors.greenAccent[500] }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteOutlinedIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      fetchLines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (line) => {
    setEditLine(line);
    formik.setValues({
      fromId: Number(line.fromId),
      toId: Number(line.toId),
      cost: Number(line.cost),
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (values.fromId === values.toId) {
      setLogicError(true);
      return;
    }

    const duplicate = lines.some(
      (line) =>
        ((line.fromId === values.fromId && line.toId === values.toId) ||
          (line.fromId === values.toId && line.toId === values.fromId)) &&
        (!editLine || line.id !== editLine.id)
    );
    if (duplicate) {
      setDuplicatedError(true);
      return;
    }

    const payload = {
      fromId: values.fromId,
      toId: values.toId,
      cost: Number(values.cost),
    };

    if (editLine) {
      try {
        await updateLine({
          id: editLine.id,
          fromId: values.fromId,
          toId: values.toId,
          cost: Number(values.cost),
        });
      } catch (error) {
        console.log(error.Title);
        console.log(editLine.id);
        console.log(payload);
      }
    } else {
      try {
        await addLine(payload);
      } catch (error) {
        console.log(error);
        console.log(error.Title);
      }
    }
    setOpenDialog(false);
    setEditLine(null);
    fetchLines();
    resetForm();
    setDuplicatedError(false);
    setLogicError(false);
  };

  const formik = useFormik({
    initialValues: { fromId: null, toId: null, cost: "" },
    validationSchema: Yup.object({
      fromId: Yup.number().required("Required"),
      toId: Yup.number().required("Required"),
      cost: Yup.number().required("Required").positive("Must be positive"),
    }),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

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
        <Header title="Lines" subtitle="View and manage travel lines" />
        <Button
          variant="contained"
          onClick={() => {
            setEditLine(null);
            formik.resetForm();
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
          Add Line
        </Button>
      </Box>
      <Box display="inline-flex" gap={3}>
        <Box
          display="flex"
          alignItems="center"
          backgroundColor={colors.primary[500]}
          borderRadius="10px"
          width="50vh"
          //margin={1}
          px={1}
          py={0.5}
        >
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.englishName}
            onChange={(e, value) => setCityFromId(value?.id || null)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search with city from name.."
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
          width="50vh"
          //margin={1}
          px={1}
          py={0.5}
        >
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.englishName}
            onChange={(e, value) => setCityToId(value?.id || null)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search with city to name.."
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
          rows={lines}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalPages * pageSize}
          page={pageNumber}
          onPageChange={async (newPage) => {
            setPageNumber(newPage);
            await fetchLines();
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            setPageNumber(0);
            await fetchLines();
          }}
          pageSize={pageSize}
          getRowId={(row) => row.id}
          sx={{ mt: 3, height: "70vh" }}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editLine ? "Edit Line" : "Add Line"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {duplicateError && <Alert severity="error">Duplicate line</Alert>}
            {logicError && <Alert severity="error">Can't be same cities</Alert>}

            <Autocomplete
              value={cities.find((c) => c.id === formik.values.fromId) || null}
              onChange={(e, val) => handleCityAutocompleteChange("fromId", val)}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const isExisting = options.some(
                  (option) => option.englishName === params.inputValue
                );
                if (params.inputValue !== "" && !isExisting) {
                  filtered.push(`Add new city: ${params.inputValue}`);
                }
                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={cities}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.englishName
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From City"
                  fullWidth
                  sx={{ my: 2 }}
                />
              )}
            />

            <Autocomplete
              value={cities.find((c) => c.id === formik.values.toId) || null}
              onChange={(e, val) => handleCityAutocompleteChange("toId", val)}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const isExisting = options.some(
                  (option) => option.englishName === params.inputValue
                );
                if (params.inputValue !== "" && !isExisting) {
                  filtered.push(`Add new city: ${params.inputValue}`);
                }
                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={cities}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.englishName
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To City"
                  fullWidth
                  sx={{ my: 2 }}
                />
              )}
            />

            <TextField
              sx={{ my: 2 }}
              label="Cost"
              name="cost"
              fullWidth
              margin="normal"
              value={formik.values.cost}
              onChange={formik.handleChange}
              error={formik.touched.cost && Boolean(formik.errors.cost)}
              helperText={formik.touched.cost && formik.errors.cost}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editLine ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openCityDialog} onClose={() => setOpenCityDialog(false)}>
        <DialogTitle>Add New City</DialogTitle>
        <DialogContent>
          <TextField
            label="Arabic Name"
            fullWidth
            margin="normal"
            value={newCityNameArabic}
            onChange={(e) => setNewCityNameArabic(e.target.value)}
          />
          <TextField
            label="English Name"
            fullWidth
            margin="normal"
            value={newCityNameEnglish}
            onChange={(e) => setNewCityNameEnglish(e.target.value)}
          />
          <Autocomplete
            options={cities}
            getOptionLabel={(c) => c.englishName}
            value={cities.find((c) => c.id === newCityParentId) || null}
            onChange={(e, val) => setNewCityParentId(val?.id || null)}
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
          <Button onClick={() => setOpenCityDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCity}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Index;
