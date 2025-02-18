"use client";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Container, CssBaseline, Button } from "@mui/material";
import { toast } from "react-toastify";

import FileUpload from "@/components/ui/fileupload";
import { useMovieStore } from "@/store/movieStore";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import useWindowResize from "@/hooks/useWindowResize";
import { createMovieSchema } from "@/lib/zod";
import Movie from "../page";

export default function EditMovie(isNewItem: boolean, id: number) {
  useWindowResize()
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations('moviePage')
  const isMobile = useStore((state)=>state.isMobile)
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { addMovie } = useMovieStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createMovieSchema(t).safeParseAsync({title, year, image})
    if(!res.success){
      toast.error(res.error.issues[0].message);
      return
    }
    if (!session?.user?.id){
      router.push(`/${locale}/auth/login`)
    }
    let imgUrl = "";
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imgUrl = data.url;
      } catch (error) {
        toast.error(t('upload_failed'));
        return;
      }
    }
    try{
      const movieData = { title, year, imgUrl };
      const res = await addMovie(movieData, session.user.id);
      toast.success(t('add_success'))
    }
    catch(err){
      console.log(err)
    }
  };

  return (
    <div className="lg:px-32, md:px-16, sm:px-4">
      {/* Header */}
      <CssBaseline />
      <div  className="add-page-body">
        {/* Main Content */}
        <Container className="flex items-center justify-center flex-col">
            <span className={`${isMobile ? 'h3' : 'h2'} text-white flex items-center gap-2 my-10 w-full`}>
            {t('create_movie')}
            </span>
            <div className="w-full flex items-center flex-col md:flex-row-reverse  md:items-start  gap-4 md:gap-24 justify-center relative pb-16">
              <div className="flex flex-col md:basis-1/4 items-start justify-center gap-4 w-full lg:w-1/2 py-4 md:flex-">  
                <input type="text" placeholder={t('title')} className="item-input bs w-full " onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder={t('publish_year')} className="item-input bs w-full md:max-w-[200px]" onChange={(e) => setYear(e.target.value)} />
                <div className="btn-container flex items-center justify-between gap-4 w-full hidden md:block">
                  <Button variant="contained" data-testid="cancel-button" className="btn w-1/2 bs card" onClick={() => router.push(`/${locale}/movies`)}>
                    {t('cancel')}
                  </Button>
                  <Button variant="contained" data-testid="submit-button" className="btn w-1/2 bs" onClick={handleSubmit}>
                    {t('submit')}
                  </Button>
              </div>
              </div>
              <FileUpload setFile={setImage} />
              <div className="btn-container flex items-center justify-center gap-4 w-full block md:hidden">
                  <Button variant="contained" data-testid="cancel-button1" className="btn w-1/2 bs card" onClick={() => router.push(`/${locale}/movies`)}>
                  {t('cancel')}
                  </Button>
                  <Button variant="contained" data-testid="submit-button1" className="btn w-1/2 bs" onClick={handleSubmit}>
                  {t('submit')}
                  </Button>
              </div>
            </div>
        </Container>
      </div>
    </div>
  );
}
