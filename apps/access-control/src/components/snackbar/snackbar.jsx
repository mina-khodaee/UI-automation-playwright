import { FiCheckCircle } from "react-icons/fi";
import { GrCircleInformation } from "react-icons/gr";
import { PiWarningOctagonFill } from "react-icons/pi";
import { FaExclamationTriangle } from "react-icons/fa";

import Portal from '@mui/material/Portal';

import { SnackbarRoot } from './styles';
import { snackbarClasses } from './classes';

// ----------------------------------------------------------------------

export function Snackbar() {
  return (
    <Portal>
      <SnackbarRoot
        expand
        gap={12}
        closeButton
        offset={16}
        visibleToasts={4}
        position="top-right"
        className={snackbarClasses.root}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: snackbarClasses.toast,
            icon: snackbarClasses.icon,
            // content
            content: snackbarClasses.content,
            title: snackbarClasses.title,
            description: snackbarClasses.description,
            // button
            actionButton: snackbarClasses.actionButton,
            cancelButton: snackbarClasses.cancelButton,
            closeButton: snackbarClasses.closeButton,
            // state
            default: snackbarClasses.default,
            info: snackbarClasses.info,
            error: snackbarClasses.error,
            success: snackbarClasses.success,
            warning: snackbarClasses.warning,
          },
        }}
        icons={{
          loading: <span className={snackbarClasses.loadingIcon} />,
          info: <GrCircleInformation className={snackbarClasses.iconSvg} />,
          success: <FiCheckCircle className={snackbarClasses.iconSvg} />,
          warning: (
            <FaExclamationTriangle className={snackbarClasses.iconSvg} />
          ),
          error: <PiWarningOctagonFill className={snackbarClasses.iconSvg} />,
        }}
      />
    </Portal>
  );
}
