export function PageShell({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100dvh-63px)] flex-col md:h-[100dvh]">
      {header}
      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
        {children}
      </div>
    </div>
  );
}
