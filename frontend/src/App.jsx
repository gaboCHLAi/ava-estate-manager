import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateListing from "./pages/CreateListing";
import Home from "./pages/Home";
import ListingDetails from "./Components/LisitingDetails";
import ForgotPassword from "./pages/ForgotPassword";
import { StatusProvider } from "./Components/contextAPI/Context";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./Components/Profile";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MyListings from "./pages/MyLisitings";
import ResetPassword from "./pages/ResetPassword";
import PhoneMenu from "./Components/PhoneMenu";
import NavBar from "./Components/NavBar";
import ManageListing from "./pages/ManageListing";
import EditList from "./Components/EditList";
import Footer from "./Components/Footer"; // იმპორტი უკვე გაქვს

function App() {
  return (
    <StatusProvider>
      <BrowserRouter>
        {/* მთლიანი კონტეინერი, რომელიც უზრუნველყოფს ფუტერის ბოლოში ყოფნას */}
        <div className="flex flex-col min-h-screen">
          <NavBar />

          {/* მთავარი კონტენტი: flex-grow აიძულებს ამ დივს დაიკავოს მთელი თავისუფალი ადგილი */}
          <main className="flex-grow pt-[65px] md:pt-[124px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/add-listing"
                element={
                  <ProtectedRoute>
                    <CreateListing />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/manageListing/:id" element={<ManageListing />} />
              <Route path="/editList/:id" element={<EditList />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myCards"
                element={
                  <ProtectedRoute>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route path="/PhoneMenu" element={<PhoneMenu />} />
            </Routes>
          </main>

          {/* ფუტერი გამოჩნდება ყველა გვერდზე */}
          <Footer />
        </div>
      </BrowserRouter>
    </StatusProvider>
  );
}

export default App;
