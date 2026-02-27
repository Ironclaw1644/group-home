'use client';

import { Suspense, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { buildLeadMessage } from '@/lib/forms';

type ExtraField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'checkbox';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

type SummaryField = {
  name: string;
  label: string;
  fallback?: string;
};

type LeadFormProps = {
  leadType: string;
  title: string;
  description?: string;
  extraFields: ExtraField[];
  summaryFields: SummaryField[];
  summaryLeadLabel?: string;
  successRedirect?: string;
  defaultCompanyName?: string;
  noteWarning?: string;
  onSubmitted?: () => void;
};

export function LeadForm(props: LeadFormProps) {
  return (
    <Suspense fallback={<div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-card sm:p-7"><p className="text-sm text-brand-slate">Loading form...</p></div>}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}

function LeadFormInner({
  leadType,
  title,
  description,
  extraFields,
  summaryFields,
  summaryLeadLabel,
  successRedirect,
  defaultCompanyName,
  noteWarning,
  onSubmitted
}: LeadFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const utmMeta = useMemo(() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    return Object.fromEntries(keys.map((k) => [k, searchParams.get(k) || undefined]));
  }, [searchParams]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const values = Object.fromEntries(formData.entries()) as Record<string, string>;
    const freeText = values.notes || '';
    const meta = {
      lead_type: leadType,
      ...utmMeta,
      ...Object.fromEntries(Object.entries(values).filter(([k]) => !['contact_name', 'contact_email', 'contact_phone', 'company_name', 'notes'].includes(k)))
    };

    const payload = {
      contact_name: values.contact_name || '',
      contact_email: values.contact_email || '',
      contact_phone: values.contact_phone || '',
      company_name: values.company_name || defaultCompanyName || '',
      page_path: pathname || undefined,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      ...utmMeta,
      message: buildLeadMessage(
        [
          `Lead Type: ${summaryLeadLabel || leadType}`,
          ...summaryFields.map((field) => `${field.label}: ${values[field.name] || field.fallback || 'Not provided'}`)
        ],
        meta,
        freeText
      )
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Submission failed');
      setSuccess(true);
      onSubmitted?.();
      if (successRedirect) {
        router.push(successRedirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-card sm:p-7">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-brand-navy">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-7 text-brand-slate">{description}</p> : null}
      </div>
      {success && !successRedirect ? <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Thanks. We received your request and will follow up soon.</p> : null}
      {error ? <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <form action={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="contact_name" label="Name" required />
          <Field name="contact_email" label="Email" type="email" required />
          <Field name="contact_phone" label="Phone" type="tel" required />
          <Field name="company_name" label="Company / Agency (optional)" defaultValue={defaultCompanyName || ''} />
        </div>
        {extraFields.map((field) => (
          <Field key={field.name} {...field} />
        ))}
        {noteWarning ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">{noteWarning}</p> : null}
        <Button type="submit" className="w-full sm:w-auto" variant="secondary">
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}

function Field({ name, label, type = 'text', options, required, placeholder, helperText, defaultValue }: ExtraField & { defaultValue?: string }) {
  const id = `field-${name}`;
  const classes = 'mt-1 w-full rounded-xl border border-brand-navy/10 bg-white px-3 py-2.5 text-sm text-brand-navy outline-none ring-0 placeholder:text-brand-slate/60 focus:border-brand-teal';
  return (
    <label className={type === 'textarea' ? 'block' : 'block'} htmlFor={id}>
      <span className="text-sm font-medium text-brand-navy">{label}{required ? ' *' : ''}</span>
      {type === 'textarea' ? (
        <textarea id={id} name={name} required={required} placeholder={placeholder} className={`${classes} min-h-28`} defaultValue={defaultValue} />
      ) : type === 'select' ? (
        <select id={id} name={name} required={required} className={classes} defaultValue="">
          <option value="">Select...</option>
          {options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-brand-navy/10 bg-brand-sand/70 px-3 py-2">
          <input id={id} name={name} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-brand-navy/20" defaultChecked={defaultValue === 'true'} />
          <span className="text-sm text-brand-slate">{placeholder || helperText}</span>
        </div>
      ) : (
        <input id={id} name={name} type={type} required={required} placeholder={placeholder} className={classes} defaultValue={defaultValue} />
      )}
      {helperText && type !== 'checkbox' ? <span className="mt-1 block text-xs text-brand-slate">{helperText}</span> : null}
    </label>
  );
}
