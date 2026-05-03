import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GeneratorForm } from "@/components/generator/GeneratorForm";
import { ContentResult } from "@/components/generator/ContentResult";
import { generateContent } from "@/utils/generator";
import type { GeneratedContent, GeneratorFormData } from "@/types/content";
import { toast } from "@/hooks/use-toast";
import { useHistory } from "@/hooks/useHistory";

const Index = () => {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const { add } = useHistory();

  useEffect(() => {
    // garante tema persistido aplicado
    const saved = localStorage.getItem("biblebuilder:theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);

  const handleGenerate = async (data: GeneratorFormData) => {
    setLoading(true);
    setContent(null);
    try {
      const result = await generateContent(data);
      setContent(result);
      add(result);
      requestAnimationFrame(() => {
        document.getElementById("result-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      toast({ title: "Erro ao gerar", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Gerador de Conteúdo"
      subtitle="Crie pregações, estudos, devocionais e saudações com profundidade."
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <GeneratorForm onGenerate={handleGenerate} loading={loading} />
        </div>
        <div id="result-anchor">
          <ContentResult content={content} loading={loading} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
