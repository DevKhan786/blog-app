export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="max-w-3xl border-l border-r border-zinc-800 w-full min-h-screen flex flex-col mx-auto p-4">
        {children}
      </div>
    </div>
  );
}
