import { BreadcrumbJsonLd } from "@/lib/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Twitter / X Downloader", path: "/twitter" }]} />
      {children}
    </>
  );
}
