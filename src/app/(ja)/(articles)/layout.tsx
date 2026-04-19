interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">{children}</div>;
}
