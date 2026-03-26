export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">{children}</div>;
}
