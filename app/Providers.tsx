"use client";

import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ThemeProvider ,createTheme} from "@mui/material/styles"
export function Provider({ children}:{ children :React.ReactNode}){
    const theme = createTheme()
    return(
    // <LocalizationProvider>
    // <ThemeProvider theme = {theme}> 
    <SessionProvider>
        { children }
        </SessionProvider>
    //      </ThemeProvider>
    // </LocalizationProvider>
      
    )
}