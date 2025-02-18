"use client";
import React, { useState } from "react"
import { toast } from "react-toastify"
import { useTranslations } from 'next-intl'
import {
  Typography,
  IconButton,
  Container,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
  CssBaseline, 
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useParams } from "next/navigation";
import useWindowResize from "@/hooks/useWindowResize";
import { createSignUpSchema } from "@/lib/zod";
import { useStore } from "@/store/useStore";

const Register = () => {
  useWindowResize()
  const t = useTranslations('authPage') 
  const {locale} = useParams()
  const isMobile = useStore((state)=>state.isMobile)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async () => {
    const res = await createSignUpSchema(t).safeParseAsync({email, password, confirmPassword})
    if(!res.success){
      setError(res.error.issues[0].message);
      return
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success( t('signup_success') );
      } else {
        setError(data.error || t('invalid_e_p'));
      }
    } catch (err) {
      console.error("Error during register:", err);
      setError(t('server_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <CssBaseline />
      <div className="login-page-body">

        {/* Login Form */}
        <Container className="login-page-container">
          <Paper className="text-center login-page-paper shadow-none">
            <Typography  align="center" gutterBottom className={`${isMobile ? 'h2' : 'h1'} text-white`}>
              {t('sign_up')}
            </Typography>
            {error && (
              <Typography color="error" align="center"  className="bes mb-2 error-container">
                {error}
              </Typography>
            )}
            <Box mb={1} className="flex flex-col items-center gap-4">
              <TextField className="bs email-input"
                label={t('email')}
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
                InputLabelProps={{
                  style: { color:  "#fff", marginTop: '-5px' },
                }}
                InputProps={{
                style: { color:  "#fff" , backgroundColor:'#224957', border: 'none' ,height: "45px"},
                }}
              />
              <TextField
                label={t('password')}   className="bs items-center flex justify-center"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ color : "#fff" }}
                          />
                        ) : (
                          <Visibility
                            sx={{ color:  "#fff" }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color:  "#fff", backgroundColor:'#224957', border: 'none' ,height: "45px"},
                }}
                InputLabelProps={{
                  style: { color:  "#fff", marginTop: '-5px' },
                  "aria-label":'password-label'
                }}
              />
              <TextField
                label={t('confirm')}   className="bs items-center flex justify-center"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ color : "#fff" }}
                          />
                        ) : (
                          <Visibility
                            sx={{ color:  "#fff" }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color:  "#fff",  backgroundColor:'#224957', border: 'none' ,height: "45px"},
                }}
                InputLabelProps={{
                  style: { color:  "#fff", marginTop: '-5px' },
                }}
              />
            </Box>
            <Button
              className="br"
              variant="contained"
              fullWidth
              onClick={handleRegister}
              disabled={isLoading}
              sx={{
                color: "#fff",
                backgroundColor: 'var(--primary)',
                height: "54px",
                "&:hover": {
                  backgroundColor: 'var(--primary)',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                t('register')
              )}
            </Button>
            <Typography className="bes" variant="body2" align="center" sx={{ mt: 0.5 , color: 'gray'}}>
              {t('have_account')}{"  "}
              <a
                href={`/${locale}/auth/login`}
                style={{ color: 'white'}}
              >
                {t('sign_in')}
              </a>
            </Typography>
          </Paper>
        </Container>
      </div>
    </>
  );
}
export default Register