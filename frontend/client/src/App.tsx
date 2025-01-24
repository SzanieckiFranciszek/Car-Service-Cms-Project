import { useEffect, useState } from "react";
import styles from './app.module.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { getAllPhotos, getAllVisiblePagesWithSections, getHomepageImage, Page, Photo } from "./apiService";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home/Home";
import CustomPage from "./pages/custom/CustomPage";
import Gallery from "./pages/gallery/Gallery";



interface DashboardProps {
  data: Page[]
}

const Dashboard = ({data}: DashboardProps) => {

  return (
    <div className={styles.main}>
      <Header pagesData={data}/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

const ErrorPage = () => {

  return (
    <div className={styles.main}>
      <div className={styles.errorWrapper}>

        <h1>Coś poszło nie tak</h1>
      </div>
    </div>
  )
}

function App() {

  const [pages, setPages] = useState<Page[]>([])
  const [photosToDisplay, setPhotosToDisplay] = useState<Photo[]>([]);
  
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    const getPages = async () => {
      const result = await getAllVisiblePagesWithSections()
      if(result) {
        setPages(result)
      }
    }

    const fetchImage = async () => {
      const result = await getHomepageImage();
      if (result) {
        const url = URL.createObjectURL(result);
        setImageURL(url);
      }
    };

    const fetchAllPhotos = async () => {
      const result = await getAllPhotos();
      if (result) {
        setPhotosToDisplay(result);
      }
    };

    getPages()
    fetchImage();
    fetchAllPhotos();

  }, [])

  const homepagePath = pages.find(page => page.isHomepage)?.name;

  return (
    <>
    <Router>
      <Routes>
        {homepagePath && <Route path="/" element={<Navigate to={`/${homepagePath}`} replace />}/> }
        <Route path={'/'} element={pages.length > 0 ? <Dashboard data={pages}/> : <ErrorPage/>}>

        {
          pages.map(page => {
            if (page.isHomepage) {
              return <Route key={page.id} path={page.name} element={<Home pageData={page} imageURL={imageURL}/>}/>
            }
            else if (page.isGallery) {
              return <Route key={page.id} path={page.name} element={<Gallery photosData={photosToDisplay}  pageData={page}/>}/>

            }
            else {
              return <Route key={page.id} path={page.name} element={<CustomPage data={page}/>}/>
            }
          })
        }
        {homepagePath ? <Route path={"*"} element={<Navigate to={`/${homepagePath}`} replace/>}/> : <Route path={"*"} element={<ErrorPage/>}/>}
        </Route>
      </Routes>
    </Router>

    </>
  );
}
        // {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
export default App;

{/* <Router>
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="pages" element={<Pages />} />
          <Route path="posts" element={<Posts />} />
          <Route path="opinions" element={<Opinions />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </Router> */}