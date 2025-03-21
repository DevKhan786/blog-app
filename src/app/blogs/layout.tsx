export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen ">
      <div className="max-w-3xl border-l border-r bg-zinc-900/80 border-zinc-800 w-full min-h-screen flex flex-col mx-auto px-4 py-2">
     
        {children}
      </div>
    </div>
  );
}
