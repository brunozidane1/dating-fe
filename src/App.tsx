import { useState } from "react";
import { CircleHelp, X } from "lucide-react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./index.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import { CompleteSignupProfilePage, ForgotPasswordPage, SignupPage } from "./pages/AuthPages";
import { ChatPage, ConnectionsPage, DiscoverPage, EditProfilePage, InfoPage, MatchesPage, MessagesPage, NotificationsPage, PricingPage, ProfileDetailPage, ProfileStudioPage, SearchPage, SettingsPage } from "./pages/ProductPages";

function Shell() {
  const { pathname } = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const auth = ["/login", "/signup", "/forgot-password"].includes(pathname);
  const messenger = pathname === "/messages" || pathname.startsWith("/chat/");
  return <>{!auth && <Header/>}<main className="min-h-screen"><Routes>
    <Route path="/" element={<Home />} /><Route path="/discover" element={<DiscoverPage />} /><Route path="/profiles/:id" element={<ProfileDetailPage />} /><Route path="/matches" element={<MatchesPage />} /><Route path="/connections" element={<ConnectionsPage />} /><Route path="/messages" element={<MessagesPage />} /><Route path="/notifications" element={<NotificationsPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="/profile" element={<ProfileStudioPage />} /><Route path="/profile/edit" element={<EditProfilePage />} /><Route path="/profile/complete" element={<CompleteSignupProfilePage />} /><Route path="/search" element={<SearchPage />} /><Route path="/chat/:id" element={<ChatPage />} /><Route path="/pricing" element={<PricingPage />} /><Route path="/login" element={<Login />} /><Route path="/signup" element={<SignupPage />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} />
    {['about', 'safety', 'help', 'contact', 'guidelines', 'privacy', 'terms', 'cookies'].map((page) => <Route key={page} path={`/${page}`} element={<InfoPage page={page}/>} />)}<Route path="*" element={<InfoPage page="help" />} />
  </Routes></main>{!auth && !messenger && <Footer/>}<div className="help-widget">{helpOpen && <aside className="help-popover"><button onClick={() => setHelpOpen(false)} aria-label="Close help"><X size={15}/></button><strong>Need a hand?</strong><p>Find answers, report a concern, or contact the Lume team.</p><a href="/help">Visit Help Centre</a></aside>}<button className="help-toggle" onClick={() => setHelpOpen(!helpOpen)} aria-expanded={helpOpen} aria-label="Open help"><CircleHelp size={20}/><span>Help</span></button></div></>;
}
function App() {
  return <BrowserRouter><Shell /></BrowserRouter>;
}

export default App;
