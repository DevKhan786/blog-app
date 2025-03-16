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
      <body>
        <AuthContextProvider>
          <GlobalLoading />
          <Header />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
