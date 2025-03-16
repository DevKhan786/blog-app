import CategoryFormProvider from "./contexts/CategoryFormContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CategoryFormProvider>{children}</CategoryFormProvider>;
}
