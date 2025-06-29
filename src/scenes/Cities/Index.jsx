import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";
import { useAppContext } from "../../context/AppContext";
import { getCities, deleteData, addCity, updateCity } from "../../Apis/CityApi";
function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const { isSidebarOpen } = useAppContext();

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [PageNumber, setPageNumber] = useState(0);
  const [PageSize, setPageSize] = useState(25);
  const [Name, setName] = useState("");
  const [cityInputValue, setCityInputValue] = useState("");

  const fetchCities = useCallback(async () => {
    try {
      const data = await getCities({
        Name: Name,
        PageNumber: PageNumber + 1,
        PageSize: PageSize,
      });
      setRows(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      alert("Couldn't reach any data!");
    }
  }, [Name, PageNumber, PageSize]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    fetchCities();
  }, [PageNumber, PageSize, Name, fetchCities]);
  const checkExists = (value, field) => {
    return rows.some(
      (city) => city[field].toLowerCase() === value.toLowerCase()
    );
  };

  const formik = useFormik({
    initialValues: { arabicName: "", englishName: "", cityId: null, id: null },
    enableReinitialize: true,
    validationSchema: Yup.object({
      arabicName: Yup.string()
        .required()
        .min(2)
        .test(function (value) {
          if (!value) return true;
          return (
            !checkExists(value, "arabicName") ||
            (editCity && editCity.arabicName === value)
          );
        }),
      englishName: Yup.string()
        .required()
        .min(2)
        .test(function (value) {
          if (!value) return true;
          return (
            !checkExists(value, "englishName") ||
            (editCity && editCity.englishName === value)
          );
        }),
      cityId: Yup.number().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      try {
        if (editCity != null) {
          try {
            await updateCity({
              id: editCity.id,
              arabicName: values.arabicName,
              englishName: values.englishName,
              cityId: values.cityId,
            });
          } catch (error) {
            alert(`${error.Title}`);
          }
        } else {
          try {
            await addCity({
              arabicName: values.arabicName,
              englishName: values.englishName,
              cityId: values.cityId,
            });
          } catch (error) {
            alert(`${error.Title}`);
          }
        }

        fetchCities();
        resetForm();
        setEditCity(null);
        setOpenDialog(false);
      } catch (error) {
        console.log(error);
        alert(` Failed to ${values.id != null ? "update" : "add"} city`);
      }
    },
  });
  useEffect(() => {
    if (editCity && formik.values.cityId) {
      const matched = rows.find((c) => c.cityId === formik.values.cityId);
      if (matched) setCityInputValue(matched.arabicName);
    }
  }, [editCity, formik.values.cityId, rows]);
  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      fetchCities();
    } catch (error) {
      console.error(error);
      alert("Unable to delete");
    }
  };
  const handleEdit = (city) => {
    setEditCity(city);
    formik.setValues({
      id: city.id,
      arabicName: city.arabicName,
      englishName: city.englishName,
      cityId: city.cityId,
    });
    setOpenDialog(true);
  };
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "arabicName", headerName: "Ar-name", flex: 1 },
    { field: "englishName", headerName: "En-name", flex: 1 },
    {
      field: "cityId",
      headerName: "cityId",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return <Box>{params.value}</Box>;
        } else return <Box>-</Box>;
      },
    },
    {
      field: "lock",
      headerName: "Lock",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value
              ? colors.greenAccent[400]
              : colors.redAccent[400],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {params.value.toString()}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => {
              handleEdit(params.row);
            }}
          >
            <EditOutlinedIcon sx={{ color: `${colors.greenAccent[400]}` }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
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
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Header
          title="Cities"
          subtitle="Viewing and handling cities information"
        />
        <Button
          variant="contained"
          onClick={() => {
            setEditCity(null);
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
          Add City
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        gap={2}
        flexWrap="wrap"
      >
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
            options={rows.map((c) => c.arabicName)}
            inputValue={Name}
            onInputChange={(e, value) => {
              setName(value);
              fetchCities(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search with city name.."
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle> {editCity ? "Edit City" : "Add City"} </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Autocomplete
              freeSolo
              options={rows.map((c) => c.arabicName)}
              inputValue={formik.values.arabicName}
              onInputChange={(e, value) =>
                formik.setFieldValue("arabicName", value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="arabicName"
                  label="Arabic Name"
                  error={
                    formik.touched.arabicName &&
                    Boolean(formik.errors.arabicName)
                  }
                  helperText={
                    formik.touched.arabicName && formik.errors.arabicName
                  }
                  sx={{ my: 2 }}
                />
              )}
            />
            <Autocomplete
              options={rows}
              getOptionLabel={(option) => option.arabicName || ""}
              inputValue={cityInputValue}
              onInputChange={(e, value) => {
                setCityInputValue(value);

                const matchedCity = rows.find((c) => c.arabicName === value);
                formik.setFieldValue(
                  "cityId",
                  matchedCity ? matchedCity.cityId : null
                );
              }}
              onChange={(e, value) => {
                if (value) {
                  setCityInputValue(value.arabicName);
                  formik.setFieldValue("cityId", value.cityId);
                } else {
                  setCityInputValue("");
                  formik.setFieldValue("cityId", null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="cityId"
                  label="City region"
                  error={formik.touched.cityId && Boolean(formik.errors.cityId)}
                  helperText={formik.touched.cityId && formik.errors.cityId}
                  sx={{ my: 2 }}
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={rows.map((c) => c.englishName)}
              inputValue={formik.values.englishName}
              onInputChange={(e, value) =>
                formik.setFieldValue("englishName", value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="englishName"
                  label="English Name"
                  error={
                    formik.touched.englishName &&
                    Boolean(formik.errors.englishName)
                  }
                  helperText={
                    formik.touched.englishName && formik.errors.englishName
                  }
                  sx={{ my: 2 }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ color: `${colors.blueAccent[400]}` }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: `${colors.blueAccent[400]}` }}
            >
              {editCity ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
          rows={rows}
          columns={columns}
          pagination
          getRowId={(row) => row.id}
          rowCount={totalPages * PageSize}
          pageSize={PageSize}
          paginationMode="server"
          onPageChange={async (newPage) => {
            setPageNumber(newPage);
            await fetchCities();
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            setPageNumber(0);
            await fetchCities();
          }}
          page={PageNumber}
          sx={{ height: "70vh" }}
        />
      </Box>
    </Box>
  );
}

export default Index;
