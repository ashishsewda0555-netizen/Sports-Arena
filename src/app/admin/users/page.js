'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormSelect, FormCheckbox } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  password: z.string().optional(), // Required only for new users
  role: z.enum(['admin', 'editor']),
  isActive: z.boolean().default(true),
}).superRefine((data, ctx) => {
  // Password is required if this is a new user (we pass editingId via context theoretically, but we can just check if password is empty and warn on submit if needed, or refine here if we split schemas)
  // For simplicity, we just allow optional password for updates, but backend will reject empty password on POST.
});

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'editor', isActive: true }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await fetchApi('/admin/users');
      setUsers(data || []);
    } catch (err) {
      if (err.message.includes('FORBIDDEN') || err.message.includes('Admin access required')) {
        setErrorMsg('You do not have permission to view this page. Admin access required.');
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      reset({ name: item.name, email: item.email, role: item.role, isActive: item.isActive, password: '' });
    } else {
      setEditingId(null);
      reset({ name: '', email: '', password: '', role: 'editor', isActive: true });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        // Backend ignores empty password on update
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await fetchApi(`/admin/users/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        if (!data.password) throw new Error("Password is required for new users.");
        await fetchApi('/admin/users', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      setIsModalOpen(false);
      fetchUsers();
      toast.success(editingId ? 'User updated successfully' : 'User created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${val === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-surface-alt text-text-secondary'}`}>
          {val}
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-success/10 text-success' : 'bg-text-disabled/20 text-text-secondary'}`}>
          {val ? 'Active' : 'Deactivated'}
        </span>
      )
    }
  ];

  if (errorMsg) {
    return (
      <div>
        <AdminPageHeader title="User Management" />
        <div className="p-6 bg-error/10 border border-error/20 text-error rounded-md text-center font-medium">
          {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader 
        title="User Management" 
        description="Manage staff accounts and permissions."
        actionLabel="Add User"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={users} 
        isLoading={loading}
        onEdit={openModal}
        // No delete, just deactivate via edit
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput 
            label="Full Name" 
            name="name" 
            register={register} 
            error={errors.name} 
          />
          <FormInput 
            label="Email Address" 
            type="email"
            name="email" 
            register={register} 
            error={errors.email} 
          />
          <FormInput 
            label={editingId ? "Password (leave blank to keep current)" : "Temporary Password"} 
            type="password"
            name="password" 
            register={register} 
            error={errors.password} 
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Role" 
              name="role" 
              register={register} 
              error={errors.role}
              options={[
                { value: 'editor', label: 'Editor' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
            <div className="mt-8">
              <FormCheckbox 
                label="Account Active" 
                name="isActive" 
                register={register} 
                error={errors.isActive}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
