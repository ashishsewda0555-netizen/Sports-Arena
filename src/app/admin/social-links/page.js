'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FormInput } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { MapPin, Globe, Video, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

const schema = z.object({
  instagramUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  facebookUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  youtubeUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  googleBusinessUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export default function SocialLinksAdmin() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/social-links').catch(async () => {
         return await fetchApi('/public/social-links');
      });
      if (data) reset(data);
    } catch (err) {
      if (!err.message?.includes('not configured')) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await fetchApi('/admin/social-links', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      toast.success('Social links updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update social links');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Social Media Links" />
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-surface rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader 
        title="Social Media Links" 
        description="Manage the URLs for your social media profiles. Leave empty to hide the icon."
      />

      <div className="bg-surface border border-border rounded-lg p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-bg rounded-md border border-border mt-1">
              <Globe className="w-5 h-5 text-text-secondary" />
            </div>
            <FormInput 
              label="Instagram Profile URL" 
              name="instagramUrl" 
              register={register} 
              error={errors.instagramUrl} 
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-bg rounded-md border border-border mt-1">
              <Globe className="w-5 h-5 text-text-secondary" />
            </div>
            <FormInput 
              label="Facebook Page URL" 
              name="facebookUrl" 
              register={register} 
              error={errors.facebookUrl} 
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-bg rounded-md border border-border mt-1">
              <Video className="w-5 h-5 text-text-secondary" />
            </div>
            <FormInput 
              label="YouTube Channel URL" 
              name="youtubeUrl" 
              register={register} 
              error={errors.youtubeUrl} 
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-bg rounded-md border border-border mt-1">
              <MapPin className="w-5 h-5 text-text-secondary" />
            </div>
            <FormInput 
              label="Google Business Profile URL" 
              name="googleBusinessUrl" 
              register={register} 
              error={errors.googleBusinessUrl} 
              placeholder="https://g.page/..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Social Links'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
