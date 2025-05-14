"use client";
import React, { useState, useEffect } from "react";
import { useRouter,  useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Container, CssBaseline, Button, CircularProgress } from "@mui/material";
import { CirclePlus as PlusIcon, LogOut as LogOutIcon } from "lucide-react";
import { toast } from "react-toastify";

import { useAuthStore } from "@/store/authStore";
import { useMovieStore } from "@/store/movieStore";
import { useStore } from "@/store/useStore";
import useWindowResize from "@/hooks/useWindowResize";
import ImageCard from "@/components/ui/ImageCard";
import Empty from "./empty/page";

interface Movie {
  id: string;
  title: string;
  year: number;
  imgUrl: string;
}

export default function Movie() {
  useWindowResize()
  const { logout } = useAuthStore();
  const { movies, fetchMovies , deleteMovie} = useMovieStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pageIdx, setPageIdx] = useState(0);
  const [curData, setCurData] = useState<Movie[]>([]);
  const { locale } = useParams()
  const isMobile = useStore((state)=>state.isMobile) 
  const t = useTranslations('moviePage')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try{
        const fetchedMovies =  await fetchMovies();
        console.log(fetchedMovies); // Debug: Log fetched movies
      }
      catch(error){
        console.log(error)
      }
      finally{
        setIsLoading(false);
        console.log("loading")
      }
    };
    fetchData();
  }, [fetchMovies]);

  useEffect(() => {
    if (!isMobile)
      setCurData(movies.slice(pageIdx * 8, (pageIdx + 1) * 8));
    else setCurData(movies)
  }, [movies, pageIdx]);

  useEffect(() => {
    if (isMobile) {
      setCurData(movies);
    } else {  
      setPageIdx(0);
      setCurData(movies.slice(0, 8))
    }
  }, [isMobile]);

  const selectPage = (idx: number) => {
    if (idx !== pageIdx) {
      setPageIdx(idx);
    }
  };

  const handlePrev = () => {
    if (pageIdx !== 0) setPageIdx((prevIndex) => prevIndex - 1);
  };

  const totalPages = Math.ceil(movies.length / 8);

  const handleNext = () => {
    if (pageIdx !== totalPages - 1) setPageIdx((prevIndex) => prevIndex + 1);
  };

  const handleDeleteMovie = async (id: string) => {
    if(!confirm(t('confirm_delete')))
      return
    const res = await deleteMovie(id);
    if (!res){
      toast.error(t('delete_failed'));
    }
    if(pageIdx*8 == movies.length-1 )
      setPageIdx((prev) => prev-1)
  };

  const log_out = () => {
    signOut();
    logout();
    router.push(`/${locale}/auth/signin`);
  }
  
  return (
    <>
      {
        isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <CircularProgress size={50} sx={{ color: "primary.main" }}/>
          </div>
        ) : movies.length == 0 ?  (<Empty />) : 
        (
          <div className="lg:px-16 md:px-8 sm:px-4">
            {/* Header */}
            <div className="h-24 w-full flex items-center justify-between">
              <span className={`${isMobile ? 'h3' : 'h2'} text-white flex items-center gap-2 text-center`}>
                {t('my_movies')}
                <PlusIcon size={32} className="cursor-pointer" onClick={() =>router.push(`/${locale}/movies/add`)} />
              </span>
              <span
                className="br text-white flex items-center gap-2 text-center cursor-pointer"
                onClick={log_out}
              >
                {!isMobile && t('log_out')} <LogOutIcon size={24} />
              </span>
            </div>

            <CssBaseline />
            <div className="main-page-body" >
              {/* Main Content */}
              <Container className="main-page-container">
                <div className="container relative z-40 mx-auto mt-12">
                  <div className="flex flex-wrap mx-auto lg:w-full md:w-full xl:shadow-small-blue">
                    {curData.map((item) => (
                      <div key={item.id} className="block w-1/2 text-center border lg:w-1/4 md:w-1/4 border-[0] px-3 mb-7 aspect-[0.56]">
                        <ImageCard image={item.imgUrl} title={item.title} year={item.year} id={item.id} deleteMovie={handleDeleteMovie}/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Controls */}
                {!isMobile && totalPages >= 2 && (
                  <div className="page-control inline-flex gap-1 items-center py-10">
                    <span
                      className={`br px-1 py-2 rounded-full text-white ${
                        pageIdx !== 0 ? "cursor-pointer" : "pointer-events-none opacity-30"
                      }`}
                      onClick={handlePrev}
                    >
                      {t('prev')}
                    </span>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        id={`page-${i}`}
                        className={`br cursor-pointer page-button ${pageIdx === i ? "active" : ""}`}
                        variant="contained"
                        disabled={isLoading}
                        onClick={() => selectPage(i)}
                        sx={{
                          height: "32px",
                          width: "32px",
                        }}
                      >
                        {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : i + 1}
                      </Button>
                    ))}
                    <span
                      className={`br px-1 py-2 rounded-full text-white ${
                        pageIdx !== totalPages - 1 ? "cursor-pointer" : "pointer-events-none opacity-30"
                      }`}
                      onClick={handleNext}
                    >
                      {t('next')}
                    </span>
                  </div>
                )}
              </Container>
            </div>
          </div>
        )
      }
    </>
  );
}