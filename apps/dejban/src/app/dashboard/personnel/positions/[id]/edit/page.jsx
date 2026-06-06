'use client';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { useGetPositions } from 'src/services/position/position.service';

import { PositionEditView } from 'src/sections/positions/view/positions-edit-view';
// ----------------------------------------------------------------------

const metadata = { title: `Device user edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { position, positionLoading } = useGetPositions(id);

  return (
    <>
      <title> {metadata.title}</title>

      <PositionEditView position={position} positionLoading={positionLoading} />
    </>
  );
}
