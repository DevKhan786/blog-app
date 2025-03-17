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
      <body className="bg-black text-white">
        <AuthContextProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111",
                color: "#fff",
                border: "1px solid #333",
              },
              success: {
                iconTheme: {
                  primary: "#4f46e5",
                  secondary: "#000",
                },
              },
              error: {
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
