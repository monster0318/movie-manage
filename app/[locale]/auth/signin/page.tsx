"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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

import CustomizedCheckbox from "@/components/ui/CustomizedCheckbox";
import { useAuthStore } from "@/store/authStore";
import { useStore } from "@/store/useStore";
import useWindowResize from "@/hooks/useWindowResize";
import { createSignInSchema } from "@/lib/zod";

export default function Login() {
  useWindowResize()
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('authPage')
  const { locale } = useParams(); // Use useParams to access locale
  const isMobile = useStore((state) => state.isMobile);

  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberMe");
    if (savedCredentials) {
      const { email, password , rememberMe} = JSON.parse(savedCredentials);
      setEmail(email);
      setPassword(password);
      setRememberMe(rememberMe);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true)
    const res = await createSignInSchema(t).safeParseAsync({email, password})
    if(!res.success){
      setError(res.error.issues[0].message);
      return
    }
    setError("");
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log(await (response))
      if (response?.ok) {
        setUser({email});
        if (rememberMe) {
          localStorage.setItem("rememberMe", JSON.stringify({ email, password, rememberMe }));
        } else {
          localStorage.removeItem("rememberMe");
        }
        await new Promise((resolve) => setTimeout(resolve, 500)); //  Wait for session update
        router.push(`/${locale}/movies`);
      } else {
        setError( t('incorrect') );
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError( t('server_error') );
      throw new Error()
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
              {t("sign_in")}
            </Typography>
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }} className="bes">
                {error}
              </Typography>
            )}
            <Box mb={1} >
              <TextField className="bs email-input"
                label={t('email')}
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                sx={{ marginBottom: 2 , height: 45}}
                InputLabelProps={{
                  style: { color:  "#fff", marginTop: '-5px' },
                }}
                InputProps={{
                style: { color:  "#fff" ,borderRadius: 10, backgroundColor:'#224957', border: 'none' ,height: "45px"},
                }}
              />
              <TextField
                label={t('password')}   className="bs items-center flex justify-center"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
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
                  style: { color:  "#fff", borderRadius: 10, backgroundColor:'#224957', border: 'none' ,height: "45px"},
                }}
                InputLabelProps={{
                  style: { color:  "#fff", marginTop: '-5px' },
                }}
              />
            </Box>
              <CustomizedCheckbox onChange={() => setRememberMe((prev) => !prev)}/>
            <Button
              className="br"
              variant="contained"
              fullWidth
              onClick={handleLogin}
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
                <CircularProgress size={24} sx={{ color: "#fff" }} role="progressbar"/>
              ) : (
                t('login')
              )}
            </Button>
            <Typography className="bes" variant="body2" align="center" sx={{ mt: 0.5 , color: 'gray'}}>
                {t('not_have_account')}{" "}
              <a
                href={`/${locale}/auth/signup`}
                style={{ color: 'white'}}
              >
                {t('sign_up')}
              </a>
            </Typography>
          </Paper>
        </Container>  
      </div>
    </>
  );
}
