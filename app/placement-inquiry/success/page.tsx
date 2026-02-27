import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Placement Inquiry Submitted | At Home Family Services, LLC', path: '/placement-inquiry/success', description: 'Your placement inquiry has been received. We will follow up soon.' });

export default function PlacementInquirySuccessPage() {
  return (
    <>
      <PageHero title="Thank you. Your placement inquiry was received." description="We will review your information and follow up soon to discuss next steps." />
      <Section title="Next steps">
        <Card>
          <p className="text-sm leading-7 text-brand-slate">If you need immediate assistance, call us directly. You can also request a tour while you wait for a follow-up call.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/tour">Request a Tour</Button>
            <Button href="/" variant="ghost">Return Home</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
