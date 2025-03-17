import AuthContextProvider from "../../lib/contexts/AuthContext";
import Header from "../../components/Header/Header";
import "./globals.css";
import GlobalLoading from "../../components/GlobalLoading";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 scrollbar-thumb-rounded">
        <AuthContextProvider>
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
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
