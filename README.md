# Movie-Manage

Welcome to the **Movie-Manage**, a full-stack, lightweight, and simple movie application built using **Next.js** with both backend and frontend integrated seamlessly.

This project shows the power of **Next.js** and serves as a practical demonstration of using Next.js as a complete full-stack framework, incorporating authentication, dark mode, and local storage for data persistence.

## Table of Contents

- [🌟 **Features**](#-features)
- [🚀 **Live Deployment**](#-live-deployment)
- [📂 **File Structure**](#-file-structure)
- [📋 **API Endpoints**](#-api-endpoints)
  - [**1. Prerequisites**](#1-prerequisites)
  - [**2. Clone the Repository**](#2-clone-the-repository)
  - [**3. Install Dependencies**](#3-install-dependencies)
  - [**4. Set Up Environment Variables**](#4-set-up-environment-variables)
  - [**5. Run the Development Server**](#5-run-the-development-server)
  - [**6. Build for Production**](#6-build-for-production)
- [🌐 **Using the App**](#-using-the-app)
- [📝 **Swagger API Documentation**](#-swagger-api-documentation)
- [💡 **Notes**](#-notes)
- [🧪 **Testing**](#-testing)
  - [**Running Tests**](#running-tests)
- [📝 **License**](#-license)
- [📧 **Contact**](#-contact)

## 🌟 **Features**

- Full-stack application with Next.js for both frontend and backend
- Full authentication system (Register and Login)
- User-specific Movie lists with graceful design
- CRUD operations for movie items
- Mysql database for data storage
- Responsive design
- Add, edit, delete movies
- State management using Zustand
- Localization with i18n(En, Fr)
- Form Validation with zod (email, password, movie title, pusblishing year)
- Simple pagination with no library
- API documentation using swagger
- A clean, modern, and responsive UI
- Basic testing for API endpoints and utility functions
- Easy-to-understand file structure and codebase
- Customizable with additional features and improvements

## 🚀 **Live Deployment**

The application is deployed live on **Vercel**. You can access it at [http://ec2-54-153-82-108.us-west-1.compute.amazonaws.com:3000/](http://ec2-54-153-82-108.us-west-1.compute.amazonaws.com:3000/).

The app features a landing page, authentication (login, register), a movie list, and a Swagger API documentation page.


## 📂 **File Structure**

Below is the comprehensive file structure for the project:

```
movie-manage/                                                                          
├─ app/                                        # Backend API endpoints                                        
│  ├─ api/                                                                             
│  │  ├─ auth/                                                                         
│  │  │  ├─ register/                                                                  
│  │  │  │  └─ route.ts                        # Registration route                                       
│  │  │  └─ [...nextauth]/                                                             
│  │  │     └─ route.ts                        # Login route                                       
│  │  ├─ movies/                               # Full CRUD operations for movies                                        
│  │  │  ├─ [id]/                                                                      
│  │  │  │  └─ route.ts                                                               
│  │  │  └─ route.ts                                                                  
│  │  └─ upload/                               # File Upload route                                       
│  │     └─ route.ts                                                                  
│  ├─ docs/                                    # Swagger documentation page                                        
│  │  ├─ layout.tsx                                                                   
│  │  └─ page.tsx                                                                     
│  ├─ [locale]/                                # Page localization                                         
│  │  ├─ auth/                                 # Authentication pages                                        
│  │  │  ├─ login/                                                                     
│  │  │  │  └─ page.tsx                        # Login page                                      
│  │  │  └─ register/                                                                  
│  │  │     └─ page.tsx                        # Register page                                       
│  │  ├─ movies/                               # Movie management pages                                         
│  │  │  ├─ add/                                                                       
│  │  │  │  └─ page.tsx                                                               
│  │  │  ├─ edit/                                                                      
│  │  │  │  └─ [id]/                                                                   
│  │  │  │     └─ page.tsx                                                            
│  │  │  ├─ empty/                                                                     
│  │  │  │  └─ page.tsx                                                               
│  │  │  └─ page.tsx                                                                  
│  │  └─ layout.tsx                            # Root Layout Component                                       
│  ├─ favicon.ico                                                                     
│  ├─ globals.css                                                                     
│  └─ providers.tsx                                                                   
├─ components/                                 # UI components                                        
│  ├─ Moives/                                                                          
│  │  └─ LanguageSwitcher.tsx                  # Language Switch bar                                       
│  ├─ ui/                                                                              
│  │  ├─ CustomizedCheckbox.tsx                                                       
│  │  ├─ fileupload.tsx                                                               
│  │  └─ ImageCard.tsx                                                                
│  └─ Footer.tsx                                                                      
├─ hooks/                                                                              
│  └─ useWindowResize.ts                       # Hook windows size event                                       
├─ i18n/                                                                               
│  ├─ request.ts                                                                      
│  └─ routing.ts                                                                      
├─ lib/                                        # User defined library                                        
│  ├─ prisma.ts                                # Prisma  config                                      
│  ├─ swagger.ts                               # Swagger config                                        
│  └─ zod.ts                                   # Zod validation config                                       
├─ messages/                                   # Messages for localization                                        
│  ├─ en.json                                                                         
│  └─ fr.json                                                                         
├─ prisma/                                     # Prisma configuration dir                                        
│  ├─ migrations/                                                                      
│  └─ schema.prisma                                                                   
├─ public/                                                                             
│  ├─ uploads/                                                                                                                   
│  ├─ Vector1.svg                                                                     
│  └─ Vector2.svg                                                                     
├─ store/                                      # zustand stores                                        
│  ├─ authStore.ts                             # Authentication state store                                       
│  ├─ movieStore.ts                            # Moive management store                                       
│  └─ useStore.ts                              # Mobile state store                                       
├─ eslint.config.mjs                           # ESLint configuration                                        
├─ middleware.tsx                              # API middleware                                       
├─ next.config.ts                              # Next.js configuration                                       
├─ package-lock.json                           # Locked versions of dependencies                                       
├─ package.json                                # Project dependencies and scripts                                       
├─ postcss.config.js                           # Postcss configuration                                       
├─ README.md                                   # This README file                                       
├─ tailwind.config.ts                          # Tailwind CSS configuration                                       
└─ tsconfig.json                               # TypeScript configuration                                       
```

## 📋 **API Endpoints**

Here's a table listing all the API endpoints provided by this application:

| HTTP Method | Endpoint                   | Description                       |
|-------------|----------------------------|-----------------------------------|
| `POST`      | `/api/auth/login`          | Log in with email and password |
| `POST`      | `/api/auth/register`       | Register a new user               |
| `GET`       | `/api/movies`              | Fetch all movies for a user       |
| `POST`      | `/api/movies`              | Create a new movie item           |
| `PUT`       | `/api/movies/{id}`         | Update a movie item               |
| `DELETE`    | `/api/movies/{id}`         | Delete a movie item               |
| `POST`      | `/api/upload`              | Upload image file                 |

## 🛠️ **Getting Started**

Follow this step-by-step guide to set up the project locally.

### **1. Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### **2. Clone the Repository**

```bash
git clone https://github.com/monster0318/movie-manage.git
cd movie-manage
```

### **3. Install Dependencies**

If you're using npm:

```bash
npm install --legacy-peer-deps  # because swagger-jsdoc latest version is compatible with only react 18 not 19
```

Or, if you're using Yarn:

```bash
yarn install
```

### **4. Set Up Environment Variables**

Create a `.env.local` file in the root directory if any environment variables are required. (Currently, the project doesn't use any external services that require environment variables).

### **5. Run the Development Server**

Start the development server:

```bash
npm run dev
```

Or, if using Yarn:

```bash
yarn dev
```

The application should now be running at `http://localhost:3000`.

### **6. Build for Production**

To build the project for production, run:

```bash
npm run build
```

Or, if using Yarn:

```bash
yarn build
```

To start the production server:

```bash
npm run start
```

Or:

```bash
yarn start
```

The production build will be served at `http://localhost:3000`.

## 🌐 **Using the App**

1. **Visit the Landing Page** (`/`): Introduces the app with the option to log in or register.
2. **Authentication**:

- Register: Create a new account via the `/auth/register` page.
- Login: Access your account through the `/auth/login` page.

3. **Manage movies**: Access the main movie list page (`/`) where you can add, edit, and delete movies

Alternatively, you can directly access the deployed application at [http://ec2-54-153-82-108.us-west-1.compute.amazonaws.com:3000/](http://ec2-54-153-82-108.us-west-1.compute.amazonaws.com:3000/).

## 📝 **Swagger API Documentation**

The application includes a Swagger API documentation page that lists all the available API endpoints and their descriptions. You can access the Swagger documentation at `/docs`.

For example: [http://ec2-54-153-82-108.us-west-1.compute.amazonaws.com:3000/docs](http://ec2-54-153-82-108.us-west-1.compute.amazonaws.com:3000/docs)

## 💡 **Notes**

- This application uses local storage to manage user data and movie items. For a more robust application, consider integrating a real database (e.g., Mysql, PostgreSQL).

## 🧪 **Testing**

### **Running Tests**

This project includes a few basic tests for the API endpoints and utility functions. To run the tests, use the following command:

```bash
npm run test
```

Or, if using Yarn:

```bash
yarn test
```

The tests will run and display the results in the terminal.



## 📝 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 📧 **Contact**

For any inquiries or feedback, feel free to reach out to the author at `loyalman318@gmail.com`.

Enjoy using the **Movie-Manage**! 🎉

---

Happy coding! 🚀

[Back to Top ↑](#Movie-Manage)
