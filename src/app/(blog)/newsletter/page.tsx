import { NewsletterForm } from "@/components/blog/newsletter-form";

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-3">Newsletter iFood Insights</h1>
      <p className="text-muted-foreground mb-8">Receba as últimas tendências em delivery, gastronomia, dicas para restaurantes e inovações do mercado de alimentação.</p>
      <NewsletterForm variant="page" />
    </div>
  );
}
