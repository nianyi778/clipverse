import { BreadcrumbJsonLd } from "@/lib/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Instagram Downloader", path: "/instagram" }]} />
      {children}
    </>
  );
}
