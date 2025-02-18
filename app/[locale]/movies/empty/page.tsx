"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Typography,
  Container,
  Button,
  CssBaseline, 
} from "@mui/material";

import { useStore } from "@/store/useStore";
import useWindowResize from "@/hooks/useWindowResize";

export default function Empty() {
  useWindowResize()
  const router = useRouter();
  const t = useTranslations('moviePage')
  const { locale } = useParams()
  const isMobile = useStore((state)=>state.isMobile)

  return (
    <>
      <CssBaseline />
      <div className="main-page-body">
        <Container className="main-page-container">
            <Typography align="center" gutterBottom className={isMobile ? 'h3' : 'h2'} sx={{ fontWeight: 600 }}>
            {t('empty_msg')}
            </Typography>
            <Button
              className="br max-w-300 empty-btn"
              variant="contained"
              fullWidth
              onClick={() => router.push(`/${locale}/movies/add`)}
            >
                {t('add_movie')}
            </Button>
        </Container>
      </div>
    </>
  );
}
