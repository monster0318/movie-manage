
import { object, string , number, union , instanceof as instanceof_} from "zod";

export const createSignInSchema = (t) => 
  object({
    email: string({ required_error: t('email_require') })
      .min(1, t('email_require'))
      .email(t('invalid_email')),
    password: string({ required_error: t('password_require') })
      .min(1, t('password_require'))
      .min(8, t('password_length'))
      .max(32, t('password_length_max')),
  });
  
  // Function to create the sign-up schema
export const createSignUpSchema = (t) => 
  object({
    email: string({ required_error: t('email_require') })
      .min(1, t('email_require'))
      .email(t('invalid_email')),
    password: string({ required_error: t('password_require') })
      .min(1, t('password_require'))
      .min(8, t('password_length'))
      .max(32, t('password_length_max')),
    confirmPassword: string({ required_error: t('confirm_require') })
      .min(1, t('confirm_require')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('password_not_match'),
    path: ["confirmPassword"],
  });

export const createMovieSchema = (t) =>
  object({
    title: string({ required_error : t('title_require')})
      .min(1, t('title_require')),
    year: union([
      number({ required_error: t('year_require') }),
      string({ required_error: t('year_require') })
        .regex(/^\d{4}$/, t('invalid_year')) // Ensures it's exactly 4 digits
        .transform((val) => parseInt(val, 10)) // Converts it to a number
    ])
    .refine((val) => val >= 1900 && val <= new Date().getFullYear(), {
      message: t('invalid_year'),
    }),
    image: instanceof_(File) // Ensures the input is a file
      .refine(file => file.size <= 5 * 1024 * 1024, t('file_size_exceed')) // Maximum file size 5MB
      .refine(file => ['image/jpeg', 'image/png'].includes(file.type), t('invalid_file_type')) // Allowed file types (JPEG, PNG)
  })