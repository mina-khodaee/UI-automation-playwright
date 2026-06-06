// 'use client';

// import Breadcrumbs from '@mui/material/Breadcrumbs';

// import { BackLink } from './back-link';
// import { MoreLinks } from './more-links';
// import { BreadcrumbsLink } from './breadcrumb-link';
// import {
//   BreadcrumbsRoot,
//   BreadcrumbsHeading,
//   BreadcrumbsContent,
//   BreadcrumbsContainer,
//   BreadcrumbsSeparator,
// } from './styles';

// // ----------------------------------------------------------------------

// export function CustomBreadcrumbs({
//   sx,
//   action,
//   backHref,
//   heading,
//   slots = {},
//   links = [],
//   moreLinks = [],
//   slotProps = {},
//   activeLast = false,
//   ...other
// }) {
//   const lastLink = links[links.length - 1]?.name;

//   const renderHeading = () => (
//     <BreadcrumbsHeading {...slotProps?.heading}>
//       {backHref ? <BackLink href={backHref} label={heading} /> : heading}
//     </BreadcrumbsHeading>
//   );

//   const renderLinks = () =>
//     slots?.breadcrumbs ?? (
//       <Breadcrumbs separator={<BreadcrumbsSeparator />} {...slotProps?.breadcrumbs}>
//         {links.map((link, index) => (
//           <BreadcrumbsLink
//             key={link.name ?? index}
//             icon={link.icon}
//             href={link.href}
//             name={link.name}
//             disabled={link.name === lastLink && !activeLast}
//           />
//         ))}
//       </Breadcrumbs>
//     );

//   const renderMoreLinks = () => <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />;

//   return (
//     <BreadcrumbsRoot sx={sx} {...other}>
//       <BreadcrumbsContainer {...slotProps?.container}>
//         <BreadcrumbsContent {...slotProps?.content}>
//           {(heading || backHref) && renderHeading()}
//           {(!!links.length || slots?.breadcrumbs) && renderLinks()}
//         </BreadcrumbsContent>
//         {action}
//       </BreadcrumbsContainer>

//       {!!moreLinks?.length && renderMoreLinks()}
//     </BreadcrumbsRoot>
//   );
// }
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Typography } from '@mui/material';

import { BackLink } from './back-link';
import { MoreLinks } from './more-links';
import { BreadcrumbsLink } from './breadcrumb-link';
import {
  BreadcrumbsRoot,
  BreadcrumbsHeading,
  BreadcrumbsContent,
  BreadcrumbsContainer,
  BreadcrumbsSeparator,
} from './styles';

// ----------------------------------------------------------------------

export function CustomBreadcrumbs({
  sx,
  action,
  backHref,
  heading,
  slots = {},
  links = [],
  moreLinks = [],
  slotProps = {},
  activeLast = false,
  ...other
}) {
  const lastLink = links[links.length - 1]?.name;

  const renderHeading = () => {
    const headingContent = backHref ? <BackLink href={backHref} label={heading} /> : heading;

    return (
      <BreadcrumbsHeading {...slotProps?.heading}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {typeof headingContent === 'string' ? (
            <Typography variant="h3" sx={{ fontWeight: '900 !important', fontFamily: 'IRANSansWeb' }}>
              {headingContent}
            </Typography>
          ) : (
            headingContent
          )}
        </Box>
      </BreadcrumbsHeading>
    );
  };

  const renderAction = () => {
    if (!action) return null;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
        {action}
      </Box>
    );
  };

  const renderLinks = () =>
    slots?.breadcrumbs ?? (
      <Breadcrumbs separator={<BreadcrumbsSeparator />} {...slotProps?.breadcrumbs}>
        {links.map((link, index) => (
          <BreadcrumbsLink
            key={link.name ?? index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            disabled={link.name === lastLink && !activeLast}
          />
        ))}
      </Breadcrumbs>
    );

  const renderMoreLinks = () => <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />;

  return (
    <BreadcrumbsRoot sx={sx} {...other}>
      <BreadcrumbsContainer {...slotProps?.container}>
        <BreadcrumbsContent {...slotProps?.content}>
          {(heading || backHref) && renderHeading()}
          {(!!links.length || slots?.breadcrumbs) && renderLinks()}
        </BreadcrumbsContent>
        {renderAction()}
      </BreadcrumbsContainer>

      {!!moreLinks?.length && renderMoreLinks()}
    </BreadcrumbsRoot>
  );
}