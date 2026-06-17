'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FormInput, FormTextarea, FormCheckbox, FormSelect } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';

const daySchema = z.object({
  day: z.string(),
  isOpen: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

const schema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  schedule: z.array(daySchema),
  specialNotes: z.string().optional(),
});

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function OperatingHoursAdmin() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      timezone: 'Asia/Kolkata',
      schedule: DAYS_OF_WEEK.map(day => ({ day, isOpen: true, openTime: '06:00', closeTime: '22:00' })),
      specialNotes: '',
    }
  });

  const { fields } = useFieldArray({
    control,
    name: 'schedule',
  });

  const scheduleWatch = watch('schedule');

  useEffect(() => {
    fetchOperatingHours();
  }, []);

  const fetchOperatingHours = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/operating-hours').catch(async () => {
         return await fetchApi('/public/operating-hours');
      });
      if (data && data.schedule) {
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
      await fetchApi('/admin/operating-hours', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      toast.success('Operating hours updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update operating hours');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Operating Hours" />
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-surface rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader 
        title="Operating Hours" 
        description="Manage the facility's daily schedule. Used for real-time 'Open/Closed' badges."
      />

      <div className="bg-surface border border-border rounded-lg p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-1/2 mb-6">
            <FormSelect 
              label="Timezone" 
              name="timezone" 
              register={register} 
              error={errors.timezone}
              options={[
                { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
                { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
              ]}
            />
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <table className="w-full text-left text-sm text-text-primary">
              <thead className="bg-surface-alt border-b border-border text-xs uppercase text-text-secondary">
                <tr>
                  <th className="px-6 py-4">Day</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Open Time</th>
                  <th className="px-6 py-4">Close Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fields.map((item, index) => {
                  const isOpen = scheduleWatch?.[index]?.isOpen;
                  return (
                    <tr key={item.id} className={isOpen ? 'bg-bg/50' : 'bg-surface-alt/50 opacity-60'}>
                      <td className="px-6 py-4 capitalize font-medium">
                        {item.day}
                        <input type="hidden" {...register(`schedule.${index}.day`)} />
                      </td>
                      <td className="px-6 py-4">
                        <FormCheckbox 
                          name={`schedule.${index}.isOpen`} 
                          register={register} 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="time" 
                          {...register(`schedule.${index}.openTime`)} 
                          disabled={!isOpen}
                          className="px-3 h-10 rounded border border-border bg-bg focus:ring-secondary disabled:opacity-50"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="time" 
                          {...register(`schedule.${index}.closeTime`)} 
                          disabled={!isOpen}
                          className="px-3 h-10 rounded border border-border bg-bg focus:ring-secondary disabled:opacity-50"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <FormTextarea 
              label="Special Notes or Holiday Hours" 
              name="specialNotes" 
              register={register} 
              error={errors.specialNotes} 
              rows={3}
              placeholder="e.g. Closed on major public holidays."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Schedule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
