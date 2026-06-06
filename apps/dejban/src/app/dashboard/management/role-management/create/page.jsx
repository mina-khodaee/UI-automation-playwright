'use client';

import { useRouter } from 'next/navigation';
import { RoleManagementNewEditForm } from 'src/sections/role-management/role-management-new-edit-form';

export default function CreateRolePage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/dashboard/role-management');
  };

  return (
    <RoleManagementNewEditForm
      open={true}
      onClose={handleClose}
      currentRole={null}
      onRefetch={() => {}}
    />
  );
}
