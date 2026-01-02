'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { sendCustomNewsletter } from '@/app/actions/newsletter';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { useTranslations } from 'next-intl';

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('Admin.Newsletter');
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Send className="mr-2 h-4 w-4" /> {t('sending')}
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> {t('send')}
        </>
      )}
    </Button>
  );
}

export default function ComposeEmailPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const t = useTranslations('Admin.Newsletter');

  const handleSubmit = async (formData: FormData) => {
    const result = await sendCustomNewsletter(formData);
    if (result.success) {
      toast.success(result.message);
      router.push('/admin/newsletter');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/newsletter">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> {t('back')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('newCampaignTitle')}</CardTitle>
          <CardDescription>{t('newCampaignDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                {t('subject')}
              </label>
              <Input id="subject" name="subject" placeholder={t('subjectPlaceholder')} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('messageContent')}</label>
              <RichTextEditor content={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
