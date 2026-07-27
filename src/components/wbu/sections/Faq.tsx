import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditableText } from "../EditableText";
import { Reveal, SectionHeading } from "../primitives";

const { faq } = worldBetweenUsConfig;

export function Faq() {
  return (
    <section id="faq" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline="FAQ" title={faq.title} titleId="faq-title" />
        <Reveal delay={80}>
          <Accordion type="single" collapsible className="mt-10">
            {faq.items.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`} className="border-steel/40">
                <AccordionTrigger className="text-left font-display text-lg font-light text-ivory hover:no-underline">
                  <EditableText id={`faq-${index}-q`} value={item.q} />
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-cloud/70">
                  <EditableText id={`faq-${index}-a`} value={item.a} multiline />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
