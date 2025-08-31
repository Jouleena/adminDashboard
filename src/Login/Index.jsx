import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Paper,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import Sawwah from "../assets/SawwahLogo.png";

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isAuthenticated } = useAuth();
  const { role } = useAuth();
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    error: false,
  });
  useEffect(() => {
    if (isAuthenticated && role !== 1) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, role]);
  const showMessage = (msg, error = false) => {
    setSnack({ open: true, message: msg, error });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const { phoneNumber, password } = values;
    const result = await login(phoneNumber, password);
    if (result.success) {
      if (result.data.role === 1) {
        showMessage("Signed in successfully");
        setTimeout(() => navigate("/"), 1000);
      } else {
        showMessage("You are not autherized to access the dashboard", true);
      }
    } else {
      showMessage(
        result.message || "Try again please, invalid credentials",
        true
      );
    }
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background:
          "linear-gradient(to right,rgb(65, 70, 85),rgb(54, 52, 49))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <img src={Sawwah} alt="Login" style={{ width: 80, marginBottom: 16 }} />
        <Typography variant="h3" fontWeight="bold" mb={2}>
          Sawwah admin dashboard
        </Typography>

        <Formik
          initialValues={{ phoneNumber: "", password: "" }}
          validationSchema={Yup.object({
            phoneNumber: Yup.string().required(),
            password: Yup.string().required(),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <TextField
                fullWidth
                variant="outlined"
                label="Phone number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                error={touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                margin="normal"
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                margin="normal"
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  bgcolor: "#1976d2",
                  transition: "0.3s",
                  "&:hover": {
                    bgcolor: "#1565c0",
                    transform: "scale(1.02)",
                  },
                }}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>

        <Snackbar
          open={snack.open}
          onClose={() => setSnack({ ...snack, open: false })}
          autoHideDuration={4000}
          message={snack.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={(props) => <Slide {...props} direction="up" />}
          ContentProps={{
            sx: {
              bgcolor: snack.error ? "#d32f2f" : "#2e7939",
              color: "#fff",
              fontWeight: "bold",
              textAlign:"center",
              
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Index;
