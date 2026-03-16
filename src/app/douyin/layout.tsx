import { BreadcrumbJsonLd } from "@/lib/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "抖音下载器", path: "/douyin" }]} />
      {children}
    </>
  );
}
