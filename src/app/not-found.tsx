import { SearchParamsProvider } from "../../components/SearchParamsProvider";

export default function NotFound() {
  return (
    <SearchParamsProvider>
      {(params) => (
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-400">
            {params.toString()
              ? `No page found for: ${params.toString()}`
              : "Page does not exist"}
          </p>
        </div>
      )}
    </SearchParamsProvider>
  );
}
