import { EditNoteOutlined, DeleteOutlineRounded } from "@mui/icons-material";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/store/useStore";

interface CardProp{
  image: string;
  title: string;
  year: number;
  id: string;
  deleteMovie:(id:string)=>void
}
export default function ImageCard({id, image, title, year, deleteMovie }: CardProp) {
  const router = useRouter()
  const { locale } = useParams()
  const isMobile = useStore((state)=>state.isMobile)

  return (
    <Card className="image-card relative" sx={{ maxWidth: 400, bgcolor: 'var(--card)' , borderRadius: '12px', height: '100%'}}>
      <CardMedia
        component="img"
        image={image}
        alt="Random Image"
        sx={{ 
          height: 'calc(100% - 80px)',
        }}
      />
      <CardContent className="text-white py-2">
        <Typography className="bl sm:br text-left py-0" variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography className="bs text-left" variant="body2" >
          {year}
        </Typography>
      </CardContent>
      <div className="inline-flex absolute right-2 top-2 gap-1">
          <EditNoteOutlined role="button" aria-label="Edit"
            sx={{
              width: isMobile ? 16 : 32,
              height: isMobile ? 16 : 32,
              color: 'rgba(200, 200, 200, 0.6)',
              transition: 'opacity 0.3s, scale 0.3s', 
              '&:hover':{
                  opacity: 1,
                  scale: 1.3,
                  color: 'white'
              }
            }}
            onClick={()=>router.push(`/${locale}/movies/edit/${id}/`)}
          />
          <DeleteOutlineRounded role="button" aria-label="Delete"
            sx={{
              width: isMobile ? 16 : 32,
              height: isMobile ? 16 : 32,
              color: 'rgba(130, 130, 130, 0.6)',
              transition: 'opacity 0.3s, scale 0.3s', 
              '&:hover':{
                  opacity: 1,
                  scale: 1.3,
                  color: 'white'
              }
            }}
            onClick={()=>deleteMovie(id)}
          />
      </div>
    </Card>
  );
}
