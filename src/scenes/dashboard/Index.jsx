import React from 'react'
import { useAppContext } from "../../context/AppContext";
import {Box , Typography , Card } from '@mui/material'
import Header from '../../components/Header'
const  Index = () =>{
  const { isSidebarOpen } = useAppContext();
  return (
     <Box m="20px" sx={{
        ml: isSidebarOpen ? "110px":"300px",
        transition :"margin-left 0.3s ease"
        }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        </Box>
      </Box>
  )
}

export default Index
