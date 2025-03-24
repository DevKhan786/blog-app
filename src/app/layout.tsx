import AuthContextProvider from "../../lib/contexts/AuthContext";
import Header from "../../components/Header/Header";
import "./globals.css";
import GlobalLoading from "../../components/GlobalLoading";
import { Toaster } from "react-hot-toast";
import { Poppins, Orbitron, Inter } from "next/font/google";
import { ScrollToTop } from "../../components/ScrollToTop";

const poppins = Poppins({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const orbitron = Orbitron({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${orbitron.variable} ${inter.variable}`}
    >
      <body className="bg-gradient-to-br from-black via-indigo-700 to-black text-white scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 scrollbar-thumb-rounded">
        <AuthContextProvider>
          <ScrollToTop />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111",
                color: "#fff",
                border: "1px solid #ef4444",
                maxWidth: "400px",
                padding: "12px 16px",
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
              },
              success: {
                duration: 5000,
                style: {
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #4f46e5",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                },
                iconTheme: {
                  primary: "#4f46e5",
                  secondary: "#000",
                },
              },
              error: {
                duration: 6000,
                style: {
                  background: "#111",
                  color: "#fff",
                  border: "2px solid #ef4444",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#000",
                },
              },
            }}
          />
          <GlobalLoading />
          <Header />
          <div className="min-h-screen h-full fixed inset-0 opacity-10 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,gray_1px,transparent_1px),linear-gradient(to_bottom,gray_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
