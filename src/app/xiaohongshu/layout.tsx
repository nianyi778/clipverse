import { BreadcrumbJsonLd } from "@/lib/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "小红书下载器", path: "/xiaohongshu" }]} />
      {children}
    </>
  );
}
