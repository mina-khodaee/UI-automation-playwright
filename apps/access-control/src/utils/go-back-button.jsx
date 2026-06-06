import { IoReturnDownBackOutline } from "react-icons/io5";

import { Tooltip } from '@mui/material';

export default function goBackButton() {
  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div style={{ float: 'left' }}>
      <Tooltip title="بازگشت">
        <span>
          <IoReturnDownBackOutline
            onClick={handleGoBack}
            style={{ fontSize: '20px', cursor: 'pointer' }}
          />
        </span>
      </Tooltip>
    </div>
  );
}
