import { useState } from "react";
import { CircleHelp, X } from "lucide-react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import "./index.css"
import Home from "./pages/Home";
import { ForgotPasswordPage } from "./pages/AuthPages";
import { ConnectedCompleteProfilePage, ConnectedLoginPage, ConnectedSignupPage } from "./pages/ConnectedAuthPages";
import { AdminActivityPage, AdminDashboardPage, AdminLayout, AdminPlansPage, AdminUsersPage } from "./pages/AdminPages";
import { ChatPage, ConnectionsPage, DiscoverPage, EditProfilePage, InfoPage, MatchesPage, MessagesPage, NotificationsPage, PricingPage, ProfileDetailPage, ProfileStudioPage, SearchPage, SettingsPage } from "./pages/ProductPages";

function Shell() {
  const { pathname } = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const auth = ["/login", "/signup", "/forgot-password"].includes(pathname);
  const admin = pathname.startsWith("/admin");
  const messenger = pathname === "/messages" || pathname.startsWith("/chat/");
  return <>{!auth && !admin && <Header/>}<main className="min-h-screen"><Routes>
    <Route path="/" element={<Home />} /><Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} /><Route path="/profiles/:id" element={<ProtectedRoute><ProfileDetailPage /></ProtectedRoute>} /><Route path="/profile/:id" element={<ProtectedRoute><ProfileDetailPage /></ProtectedRoute>} /><Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} /><Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} /><Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} /><Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} /><Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} /><Route path="/profile" element={<ProtectedRoute><ProfileStudioPage /></ProtectedRoute>} /><Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} /><Route path="/profile/complete" element={<ProtectedRoute><ConnectedCompleteProfilePage /></ProtectedRoute>} /><Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} /><Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} /><Route path="/pricing" element={<PricingPage />} /><Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminLayout /></ProtectedRoute>}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="activity" element={<AdminActivityPage />} />
      <Route path="plans" element={<AdminPlansPage />} />
    </Route><Route path="/login" element={<ConnectedLoginPage />} /><Route path="/signup" element={<ConnectedSignupPage />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} />
    {['about', 'safety', 'help', 'contact', 'guidelines', 'privacy', 'terms', 'cookies'].map((page) => <Route key={page} path={`/${page}`} element={<InfoPage page={page}/>} />)}<Route path="*" element={<InfoPage page="help" />} />
  </Routes></main>{!auth && !admin && !messenger && <Footer/>}{!admin && !messenger && <div className="help-widget">{helpOpen && <aside className="help-popover"><button onClick={() => setHelpOpen(false)} aria-label="Close help"><X size={15}/></button><strong>Need a hand?</strong><p>Contact the Lovinara team directly.</p><p><b>Email:</b> info@lovinara.com</p><p><b>Phone:</b> 0788765430</p></aside>}<button className="help-toggle" onClick={() => setHelpOpen(!helpOpen)} aria-expanded={helpOpen} aria-label="Open help"><CircleHelp size={20}/><span>Help</span></button></div>}</>;
}
function App() {
  return <BrowserRouter><Shell /></BrowserRouter>;
}

export default App;
