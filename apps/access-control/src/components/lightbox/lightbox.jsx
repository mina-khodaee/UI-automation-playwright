import { mergeClasses } from 'minimal-shared/utils';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { GoX, GoZoomIn, GoZoomOut } from "react-icons/go";
import { GrChapterPrevious, GrChapterNext } from "react-icons/gr";
import ReactLightbox, { useLightboxState } from 'yet-another-react-lightbox';
import { RiPauseCircleLine, RiPlayCircleLine, RiFullscreenExitLine } from "react-icons/ri";

import Box from '@mui/material/Box';

import { getPlugins } from './utils';
import { lightboxClasses } from './classes';

// ----------------------------------------------------------------------

export function Lightbox({
  slides,
  disableZoom,
  disableVideo,
  disableTotal,
  disableCaptions,
  disableSlideshow,
  disableThumbnails,
  disableFullscreen,
  onGetCurrentIndex,
  className,
  ...other
}) {
  const totalItems = slides ? slides.length : 0;

  return (
    <ReactLightbox
      slides={slides}
      animation={{ swipe: 240 }}
      carousel={{ finite: totalItems < 5 }}
      controller={{ closeOnBackdropClick: true }}
      plugins={getPlugins({
        disableZoom,
        disableVideo,
        disableCaptions,
        disableSlideshow,
        disableThumbnails,
        disableFullscreen,
      })}
      on={{
        view: ({ index }) => {
          if (onGetCurrentIndex) {
            onGetCurrentIndex(index);
          }
        },
      }}
      toolbar={{
        buttons: [
          <DisplayTotal key={0} totalItems={totalItems} disableTotal={disableTotal} />,
          'close',
        ],
      }}
      render={{
        iconClose: () => <IconifyLocal width={24}><GoX /></IconifyLocal>,
        iconZoomIn: () => <IconifyLocal width={24}><GoZoomIn /></IconifyLocal>,
        iconZoomOut: () => <IconifyLocal width={24}><GoZoomOut /></IconifyLocal>,
        iconSlideshowPlay: () => <IconifyLocal width={24}><RiPlayCircleLine /></IconifyLocal>,
        iconSlideshowPause: () => <IconifyLocal width={24}><RiPauseCircleLine /></IconifyLocal>,
        iconPrev: () => <IconifyLocal width={32}><GrChapterPrevious /></IconifyLocal>,
        iconNext: () => <IconifyLocal width={32}><GrChapterNext /></IconifyLocal>,
        iconExitFullscreen: () => <IconifyLocal width={24}><GrChapterNext /></IconifyLocal>,
        iconEnterFullscreen: () => <IconifyLocal width={24}><RiFullscreenExitLine /></IconifyLocal>,
      }}
      className={mergeClasses([lightboxClasses.root, className])}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

function DisplayTotal({ totalItems, disableTotal }) {
  const { currentIndex } = useLightboxState();

  if (disableTotal) {
    return null;
  }

  return (
    <Box
      component="span"
      className="yarl__button"
      sx={{
        typography: 'body2',
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
      }}
    >
      <strong> {currentIndex + 1} </strong> / {totalItems}
    </Box>
  );
}
