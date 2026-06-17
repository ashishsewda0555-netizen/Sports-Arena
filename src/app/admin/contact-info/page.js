'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FormInput, FormTextarea } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';

const schema = z.object({
  facilityName: z.string().min(2, "Name is required"),
  address: z.object({
    street: z.string().min(5, "Street is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(4, "Zip is required"),
  }),
  location: z.object({
    lat: z.number().min(-90).max(90).or(z.string().transform(v => parseFloat(v) || 0)),
    lng: z.number().min(-180).max(180).or(z.string().transform(v => parseFloat(v) || 0)),
  }),
  phones: z.object({
    primary: z.string().min(8, "Primary phone required"),
    secondary: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
  email: z.string().email("Valid email required"),
  mapEmbedUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export default function ContactInfoAdmin() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/contact-info').catch(async () => {
         return await fetchApi('/public/contact-info');
      });
      if (data) {
        reset(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await fetchApi('/admin/contact-info', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      toast.success('Contact info updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update contact info');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Contact Information" />
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-surface rounded w-full"></div>
          <div className="h-32 bg-surface rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader 
        title="Contact Information" 
        description="Manage the main facility contact details and address."
      />

      <div className="bg-surface border border-border rounded-lg p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-medium text-primary mb-4">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Facility Name" name="facilityName" register={register} error={errors.facilityName} />
              <FormInput label="Email Address" type="email" name="email" register={register} error={errors.email} />
            </div>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-medium text-primary mb-4">Phone Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Primary Phone" name="phones.primary" register={register} error={errors.phones?.primary} />
              <FormInput label="Secondary Phone" name="phones.secondary" register={register} error={errors.phones?.secondary} />
              <FormInput label="WhatsApp Number" name="phones.whatsapp" register={register} error={errors.phones?.whatsapp} />
            </div>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-medium text-primary mb-4">Address</h3>
            <FormInput label="Street Address" name="address.street" register={register} error={errors.address?.street} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="City" name="address.city" register={register} error={errors.address?.city} />
              <FormInput label="State" name="address.state" register={register} error={errors.address?.state} />
              <FormInput label="Zip Code" name="address.zipCode" register={register} error={errors.address?.zipCode} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-medium text-primary mb-4">Location (Map)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormInput label="Latitude" type="number" step="any" name="location.lat" register={register} error={errors.location?.lat} />
              <FormInput label="Longitude" type="number" step="any" name="location.lng" register={register} error={errors.location?.lng} />
            </div>
            <FormTextarea label="Google Maps Embed URL" name="mapEmbedUrl" register={register} error={errors.mapEmbedUrl} rows={3} />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
