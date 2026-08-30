import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./index.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ForgotPasswordPage, SignupPage } from "./pages/AuthPages";
import { ChatPage, CompleteProfilePage, ConnectionsPage, DiscoverPage, EditProfilePage, InfoPage, MatchesPage, MessagesPage, MyProfilePage, NotificationsPage, PricingPage, ProfileDetailPage, SearchPage, SettingsPage } from "./pages/ProductPages";

function Shell() {
  const { pathname } = useLocation();
  const auth = ["/login", "/signup", "/forgot-password"].includes(pathname);
  const messenger = pathname === "/messages" || pathname.startsWith("/chat/");
  return <>{!auth && <Header/>}<main className="min-h-screen"><Routes>
    <Route path="/" element={<Home />} /><Route path="/discover" element={<DiscoverPage />} /><Route path="/profiles/:id" element={<ProfileDetailPage />} /><Route path="/matches" element={<MatchesPage />} /><Route path="/connections" element={<ConnectionsPage />} /><Route path="/messages" element={<MessagesPage />} /><Route path="/notifications" element={<NotificationsPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="/profile" element={<MyProfilePage />} /><Route path="/profile/edit" element={<EditProfilePage />} /><Route path="/profile/complete" element={<CompleteProfilePage />} /><Route path="/search" element={<SearchPage />} /><Route path="/chat/:id" element={<ChatPage />} /><Route path="/pricing" element={<PricingPage />} /><Route path="/login" element={<Login />} /><Route path="/signup" element={<SignupPage />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} />
    {['about', 'safety', 'help', 'contact', 'guidelines', 'privacy', 'terms', 'cookies'].map((page) => <Route key={page} path={`/${page}`} element={<InfoPage page={page}/>} />)}<Route path="*" element={<InfoPage page="help" />} />
  </Routes></main>{!auth && !messenger && <Footer/>}</>;
}
function App() {
  return <BrowserRouter><Shell /></BrowserRouter>;
}

export default App;
