import { Box, Grid, Typography, Button } from '@mui/material';
import { Field } from 'src/components/hook-form';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useState } from 'react';

export const AvatarUploadSection = ({ t_guestVisitor }) => {
  const buttonHeight = '2.5rem';
  const [leftAvatar, setLeftAvatar] = useState(null);
  const [thumbnails, setThumbnails] = useState([null, null, null, null]);

  const handleThumbnailClick = (index) => {
    if (thumbnails[index]) {
      setLeftAvatar(thumbnails[index]);
    }
  };

  const handleThumbnailUpload = (index, file) => {
    const newThumbnails = [...thumbnails];
    newThumbnails[index] = URL.createObjectURL(file);
    setThumbnails(newThumbnails);
  };

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" gap="2rem" justifyContent="end">
        <Box display="flex" flexDirection="column" textAlign="center" gap="0.5rem">
          <Field.UploadAvatar
            name="photoURLLeft"
            label="تصویر کاربر"
            sx={{
              width: '14rem',
              height: '9.5rem',
              borderRadius: '0.25rem',
            }}
          />
          <Box
            sx={{
              border: '1px solid #E0E0E0',
              borderRadius: '0.25rem',
              padding: '0.3rem',
            }}
          >
            <Typography variant="body2">نام مهمان</Typography>
          </Box>
          <Button variant="contained">نمایش مهمان</Button>
        </Box>

        <Box display="flex" flexDirection="column" textAlign="center" gap="0.5rem">
          <Field.UploadAvatar
            name="photoURLRight"
            label="تصویر کاربر"
            sx={{
              width: '16rem',
              height: '12rem',
              borderRadius: '0.25rem',
              margin: '0 auto',
            }}
          />

          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            sx={{ height: buttonHeight, fontSize: '0.9rem' }}
          >
            ثبت تصویر
          </Button>
        </Box>
      </Box>

      <Box
        display="flex"
        maxWidth="32rem"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        // border="1px solid #E0E0E0"
        // borderRadius="0.5rem"
        // gap="10px"
      >
        {thumbnails.map((thumb, index) => (
          <Box
            key={index}
            onClick={() => handleThumbnailClick(index)}
            sx={{
              display: 'flex',
              width: '6rem',
              height: '4rem',
              border: '1px solid #E0E0E0',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#e0e0e0',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' },
            }}
          >
            {thumb ? (
              <img
                src={thumb}
                alt={`thumb-${index}`}
                // style={{
                //   width: '100%',
                //   height: '100%',
                //   // objectFit: 'cover',
                // }}
              />
            ) : (
              <Field.UploadAvatar
                name={`thumbnail-${index}`}
                label=""
                // sx={{
                //   width: '100%',
                //   height: '100%',
                // }}
                onChange={(e) => handleThumbnailUpload(index, e.target.files[0])}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
