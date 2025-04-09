import { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
