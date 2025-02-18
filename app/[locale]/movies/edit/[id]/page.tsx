"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Container, CssBaseline, Button } from "@mui/material";
import { toast } from "react-toastify";

import FileUpload from "@/components/ui/fileupload";
import { useMovieStore } from "@/store/movieStore";
import { useRouter , useParams} from "next/navigation";
import { useStore } from "@/store/useStore";
import useWindowResize from "@/hooks/useWindowResize";
import { createMovieSchema } from "@/lib/zod";

export default function EditMovie() {
  useWindowResize()
  const t = useTranslations('moviePage')
  const { movies, updateMovie } = useMovieStore();
  const { data: session } = useSession();
  const router = useRouter();
  const { id, locale } = useParams();
  const isMobile = useStore((state)=>state.isMobile)
  const [image, setImage] = useState<File | null>(null);
  const movie = movies.find((m) => m.id === id);

  useEffect(() => {
    if (!movie) router.push(`/${locale}/movies`)
  }, [movie, router]);

  const [title, setTitle] = useState(movie?.title || "");
  const [year, setYear] = useState(movie?.year || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createMovieSchema(t).safeParseAsync({title, year, image})
    if(!res.success){
      toast.error(res.error.issues[0].message);
      return
    }
    if (!session?.user?.id) return;

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
      const res = await updateMovie(id, { title, year: Number(year), imgUrl });
      if(res){
        toast.success(t('add_success'))
        router.back()
      }
      else toast.success(t('update_failed'))
    }
    catch(err){
      console.log(err)
    }
  };
  
  return (
    <div className="lg:px-32, md:px-16, sm:px-4">
      {/* Header */}
      <CssBaseline />
      <div className="edit-page-body" >
        {/* Main Content */}
        <Container className="flex items-center justify-center flex-col">
            <span className={`${isMobile ? 'h3' : 'h2'} text-white flex items-center gap-2 my-10 w-full`}>
            {t('edit')}
            </span>
            <div className="w-full flex items-center flex-col md:flex-row-reverse  md:items-start  gap-4 md:gap-24 justify-center relative pb-16">
              <div className="flex flex-col md:basis-1/4 items-start justify-center gap-4 w-full lg:w-1/2 py-4 md:flex-">  
                <input type="text" placeholder="Title" value={title} className="item-input bs w-full " onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Publishing Year" value={year} className="item-input bs w-full md:max-w-[200px]" onChange={(e) => setYear(e.target.value)} />
                <div className="btn-container flex items-center justify-between gap-4 w-full hidden md:block">
                  <Button variant="contained" className="btn w-1/2 bs card" onClick={() => router.back()}>
                    {t('cancel')}
                  </Button>
                  <Button variant="contained" className="btn w-1/2 bs" onClick={handleSubmit}>
                    {t('submit')}
                  </Button>
              </div>
              </div>
              <FileUpload setFile={setImage} />
              <div className="btn-container flex items-center justify-center gap-4 w-full block md:hidden">
                  <Button variant="contained" className="btn w-1/2 bs card" onClick={() => router.back()}>
                  {t('cancel')}
                  </Button>
                  <Button variant="contained" className="btn w-1/2 bs" onClick={handleSubmit}>
                  {t('submit')}
                  </Button>
              </div>
            </div>
        </Container>
      </div>
    </div>
  );
}
