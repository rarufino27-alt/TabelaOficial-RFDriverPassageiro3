import jsPDF from "jspdf";
import type { GeneratedContent } from "@/types/content";

const MARGIN = 56; // ~ 0.78"
const LINE = 16;

export async function exportAsPdf(c: GeneratedContent): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usable = pageWidth - MARGIN * 2;
  let y = MARGIN;

  const ensure = (h: number) => {
    if (y + h > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const writeText = (text: string, opts: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number; italic?: boolean } = {}) => {
    const { size = 11, bold = false, color = [30, 30, 40], gap = 6, italic = false } = opts;
    doc.setFont("helvetica", bold ? "bold" : italic ? "italic" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, usable) as string[];
    for (const line of lines) {
      ensure(LINE);
      doc.text(line, MARGIN, y);
      y += LINE * (size / 11);
    }
    y += gap;
  };

  const writeHeading = (text: string) => {
    ensure(28);
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(2);
    doc.line(MARGIN, y - 8, MARGIN + 20, y - 8);
    writeText(text.toUpperCase(), { size: 10, bold: true, color: [99, 102, 241], gap: 8 });
  };

  // Title block
  writeText(c.title, { size: 20, bold: true, color: [20, 20, 35], gap: 4 });
  writeText(`${c.scriptureLabel}  ·  ${c.meta.version}  ·  ${c.meta.type}  ·  ${c.meta.duration} min`, {
    size: 10, color: [120, 120, 140], gap: 14,
  });

  // Spiritual banner
  doc.setFillColor(238, 240, 255);
  doc.roundedRect(MARGIN, y, usable, 42, 6, 6, "F");
  const bannerY = y + 16;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(80, 80, 120);
  const banner = "Este conteúdo é apoio ao seu estudo. A direção verdadeira vem de Deus — busque sempre a orientação do Espírito Santo.";
  const bLines = doc.splitTextToSize(banner, usable - 24) as string[];
  bLines.forEach((l, i) => doc.text(l, MARGIN + 12, bannerY + i * 12));
  y += 56;

  writeHeading("Introdução");
  writeText(c.introduction.split("\n\n")[0]);

  writeHeading("Contexto histórico-teológico");
  writeText(c.context);

  writeHeading("Desenvolvimento");
  c.development.forEach((p, i) => {
    writeText(`${i + 1}. ${p.title}`, { bold: true, size: 12, gap: 2 });
    writeText(p.body, { gap: 10 });
  });

  writeHeading("Aplicação prática");
  writeText(c.application);

  writeHeading("Conclusão");
  writeText(c.conclusion);

  writeHeading("Referências cruzadas");
  writeText(c.crossReferences.join("  •  "));

  writeHeading("Ilustração");
  writeText(c.illustration, { italic: true });

  writeHeading("Frase de impacto");
  writeText(c.impactPhrase, { size: 13, bold: true, color: [70, 70, 200] });

  writeHeading("Perguntas para reflexão");
  c.questions.forEach((q, i) => writeText(`${i + 1}. ${q}`, { gap: 2 }));
  y += 6;

  writeHeading("Chamada à ação");
  writeText(c.callToAction);

  // Footer on each page
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 160);
    doc.text(`BibleBuilder · ${i} / ${total}`, pageWidth / 2, pageHeight - 24, { align: "center" });
  }

  const safeName = c.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  doc.save(`${safeName || "biblebuilder"}.pdf`);
}
