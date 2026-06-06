'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RoleManagementNewEditForm } from 'src/sections/role-management/role-management-new-edit-form';
import { useGetRoles } from 'src/services/roleManagement/roleManagement.service';

export default function EditRolePage() {
  const [role, setRole] = useState(null);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data, isLoading } = useGetRoles({ page: 1, pageSize: 1000 });

  useEffect(() => {
    if (data?.items) {
      const currentRole = data.items.find((r) => r.id === id);
      setRole(currentRole);
    }
  }, [data, id]);

  const handleClose = () => {
    router.push('/dashboard/role-management');
  };

  if (isLoading || !role) return <div>Loading...</div>;

  return (
    <RoleManagementNewEditForm
      open={true}
      onClose={handleClose}
      currentRole={role}
      onRefetch={() => {}}
    />
  );
}
