import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useBoolean } from 'minimal-shared/hooks';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useRegionActions } from 'src/stores/region-actions-store';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RegionTreeChart } from '../region-tree-chart';
import { RegionNodeDialog } from '../region-node-dialog';
import { RegionNewForm } from '../region-new-form-dialog';
import { RegionEditForm } from '../region-edit-form-dialog';

// ----------------------------------------------------------------------

export function RegionListView() {
  const { getRegions, getRegionById, deleteRegions, regions } = useRegionActions();
  const [node, setNode] = useState();
  const { t: t_device } = useTranslate('device');
  const { t: t_common } = useTranslate();
  const deleteConfirm = useBoolean();
  const [openNewFormDialog, setOpenNewFormDialog] = useState(false);
  const [openEditFormDialog, setOpenEditFormDialog] = useState(false);
  const [openNodeDialog, setOpenNodeDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentNode, setCurrentNode] = useState();
  const [refetch, setRefetch] = useState(false);

  const onNodeClick = async (nodeId) => {
    const getNode = await getRegionById(nodeId);
    setNode(getNode);
    setOpenNodeDialog(true);
  }
  const handleDelete = async () => {
    setDeleteLoading(true);
    if (node.id === 1) {
      toast.error(t_device('toastMessages.deleteRootRegion'));
      setDeleteLoading(false);
      return
    }
    try {
      await deleteRegions(node.id)
      setOpenNodeDialog(false)
      deleteConfirm.onFalse();
      toast.success(t_device('toastMessages.deleteRegion'))
      setRefetch(!refetch);
    }
    catch (error) {
      toast.error(error);
    } finally {
      setDeleteLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await getRegions();
      } catch (error) {
        toast.error(error)
      }
    })()
  }, [refetch]);

  return (
    <div>
      <DashboardContent >
        <CustomBreadcrumbs
          heading={t_device('breadCrumb.region')}
          links={[
            { name: t_device('breadCrumb.dashboard'), href: paths.dashboard.root },
            { name: t_device('breadCrumb.region') },
          ]}
          action={
            <Button
              onClick={() => {
                setOpenNewFormDialog(true);
              }}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_device('button.newRegion')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {openNewFormDialog && <RegionNewForm open={openNewFormDialog} onClose={() => setOpenNewFormDialog(false)} onRefetch={() => setRefetch(!refetch)} />}
        {openNodeDialog && <RegionNodeDialog open={openNodeDialog} onClose={() => setOpenNodeDialog(false)} node={node} onDelete={() => deleteConfirm.onTrue()} onEdit={() => { setCurrentNode(node); setOpenNodeDialog(false); setOpenEditFormDialog(true); }} />}
        {openEditFormDialog && <RegionEditForm open={openEditFormDialog} onClose={() => setOpenEditFormDialog(false)} onRefetch={() => setRefetch(!refetch)} currentRegion={currentNode} />}
      </DashboardContent>
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title={t_common('button.delete')}
        content={t_device('texts.deleteRegionConfirm')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />
      {regions &&
        <RegionTreeChart
          onNodeClick={onNodeClick}
          data={regions}
        />
      }
    </div>
  );
}