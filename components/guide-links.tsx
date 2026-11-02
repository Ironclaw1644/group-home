import Link from 'next/link';
import { Section, Card } from '@/components/ui';
import { guidesFor, familyQuestionPath } from '@/lib/family-questions';

/** Links a money page to the single-question answers that feed it (and back). */
export function GuideLinks({ pageKey, title = 'Questions families ask', description }: { pageKey: string; title?: string; description?: string }) {
  const guides = guidesFor(pageKey);
  if (guides.length === 0) return null;
  return (
    <Section title={title} description={description ?? 'Plain-language answers about group homes and Virginia’s DD waivers, with the official sources.'}>
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <Card key={guide.slug}>
            <Link href={familyQuestionPath(guide.slug)} className="font-semibold text-brand-teal hover:text-brand-navy">{guide.question}</Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
