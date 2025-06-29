import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import TopBar from './scenes/global/TopBar'
import SideBar from './scenes/global/SideBar.jsx';
import Dashboard from "./scenes/dashboard/Index";
import Coordinate from "./scenes/Coordinate/Index";
import Buses from './scenes/Buses/Index.jsx';
import Cities from "./scenes/Cities/Index";
import Lines from "./scenes/Lines/Index";
import Login from "./Login/Index";
import { AuthProvider } from './context/AuthProvider.jsx';
import { PrivateRouter } from "./Routes/PrivateRouter"
import { useAuth } from './context/AuthContext.jsx';
function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isLoginPage = location.pathname==="/login";
  const auth= useAuth();
  const isAuthenticated = auth?.isAuthenticated;
  return (
    <AuthProvider>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage  && <SideBar/> }
          <main className="content"> 
            {!isLoginPage && <TopBar/>}
             <Routes>   
              {/* { isAuthenticated ? <Navigate to="/"replace/> : <Login/>} */}
              <Route path='/login' element ={ isAuthenticated ? <Navigate to="/"replace/> : <Login/>}/>
              <Route path="/" element={<PrivateRouter><Dashboard /></PrivateRouter>} />
              <Route path="/coordinate" element={<PrivateRouter><Coordinate /></PrivateRouter>} />
              <Route path="/bus" element={<PrivateRouter><Buses /></PrivateRouter>}/>
              <Route path="/city" element={<PrivateRouter><Cities /></PrivateRouter>}/>
              <Route path="/line" element={<PrivateRouter><Lines/></PrivateRouter>}/>
             </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
