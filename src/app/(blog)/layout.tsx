import { BlogHeader } from "@/components/blog/header";
import { BlogFooter } from "@/components/blog/footer";
import { IFoodBadge } from "@/components/blog/ifood-badge";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IFoodBadge />
      <BlogHeader />
      <main className="flex-1 min-h-screen">{children}</main>
      <BlogFooter />
    </>
  );
}
