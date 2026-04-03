import { NewsletterForm } from "@/components/blog/newsletter-form";

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-3">Newsletter iFood Na Pista</h1>
      <p className="text-muted-foreground mb-8">Fica ligado nas dicas de segurança, novidades do delivery e tudo que rola no mundo do entregador.</p>
      <NewsletterForm variant="page" />
    </div>
  );
}
