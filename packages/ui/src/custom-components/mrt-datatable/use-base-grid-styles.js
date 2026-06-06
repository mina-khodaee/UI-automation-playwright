import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { SETTINGS_STORAGE_KEY } from '../../components/settings'
import { getStorage } from "minimal-shared";
import { DEFAULT_SERIF_FONT } from "next/dist/shared/lib/constants";

import { useSettingsContext } from "../../components/settings";
// ----------------------------------------------------------------------

export function getTheme() {

  const theme = useTheme();
  const direction = theme.direction;
  const mode = theme.palette.mode;
  const primaryColor = theme.palette.primary;
  const appSetting = getStorage(SETTINGS_STORAGE_KEY)
  const font = appSetting?.fontFamily ?? DEFAULT_SERIF_FONT;

  const memoizedValue = useMemo(
    () => ({
      direction,
      mode,
      primaryColor,
      font

    }),
    [theme,appSetting]
  );

  return memoizedValue;
}


export const useBaseGridStyles = () => {
    const settings = useSettingsContext();
    const { direction, mode, primaryColor, font } = getTheme();

    const textColor = mode === 'dark' ? '#FFFFFF' : '#000000';
    
    const backgroundColor = mode === 'dark' ? '#1e1e1e' : '#fff';
    const paperBackgroundColor = mode === 'dark' ? '#2d2d2d' : '#fff';
    const headerBackgroundColor = mode === 'dark' ? '#3a3a3a' : primaryColor.lighter;
    const headerTextColor = mode === 'dark' ? '#FFFFFF' : '#000';
    const borderColor = mode === 'dark' ? '#444' : '#e0e0e0';
    const lightBorderColor = mode === 'dark' ? '#555' : '#f0f0f0';
    const rowHoverColor = mode === 'dark' ? '#2a2a2a' : '#f9f9f9';
    const selectedRowColor = mode === 'dark' ? '#2c5282' : '#e3f2fd';
    const oddRowColor = mode === 'dark' ? '#262626' : '#fcfcfc';
    const paginationBgColor = mode === 'dark' ? '#333' : '#fafafa';

    const smallerFontSize = settings?.state.fontSize - 2 || 12;

    return {
        tablePaperProps: {
            elevation: 2,
            sx: {
                borderRadius: 1,
                border: `1px solid ${borderColor}`,
                boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : 2,
                bgcolor: paperBackgroundColor,
                fontFamily: font,
                color: textColor,
                direction: 'ltr',
                '& .MuiTable-root': {
                    fontSize: smallerFontSize,
                    color: textColor,
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                    textAlign: 'center !important',
                    justifyContent: 'center !important',
                    padding: '4px 2px',
                    color: headerTextColor,
                },
                '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
                    borderBottom: `1px solid ${lightBorderColor} !important`,
                }
            },
        },

        tableContainerProps: {
            sx: {
                backgroundColor: backgroundColor,
                color: textColor,
                '& table': {
                    tableLayout: 'fixed',
                    borderCollapse: 'separate',
                    borderSpacing: '0 0',
                    color: textColor,
                }
            }
        },

        headCellProps: {
            sx: {
                backgroundColor: headerBackgroundColor,
                color: headerTextColor,
                fontWeight: 'bold',
                borderBottom: `1px solid ${borderColor}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: smallerFontSize,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 1px',
                lineHeight: '1.5',
                borderRight: `1px solid ${borderColor} !important`,
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    textAlign: 'center',
                    color: headerTextColor,
                },
                '&:last-of-type': {
                    borderRight: `1px solid ${borderColor}`,
                }
            }
        },

        bodyCellProps: {
            sx: {
                padding: '15px 1px',
                fontSize: smallerFontSize,
                borderBottom: `1px solid ${lightBorderColor}`,
                borderRight: `1px solid ${lightBorderColor}`,
                textAlign: 'center',
                lineHeight: '1.1',
                verticalAlign: 'middle',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '28px !important',
                height: '28px !important',
                boxSizing: 'border-box',
                color: textColor,
                backgroundColor: backgroundColor,
            }
        },

        rowProps: {
            sx: {
                backgroundColor: backgroundColor,
                '&:hover': {
                    backgroundColor: rowHoverColor,
                },
                '&.Mui-selected': {
                    backgroundColor: `${selectedRowColor} !important`,
                },
                '&:nth-of-type(odd)': {
                    backgroundColor: oddRowColor,
                },
                '&:last-child td': {
                    borderBottom: `1px solid ${lightBorderColor}`,
                }
            }
        },

        paginationProps: {
            sx: {
                borderTop: `1px solid ${borderColor}`,
                backgroundColor: paginationBgColor,
                fontSize: smallerFontSize - 1,
                padding: '2px 4px',
                color: textColor,
                '& .MuiButtonBase-root': {
                    color: textColor,
                },
                '& .Mui-disabled': {
                    color: mode === 'dark' ? '#666' : '#ccc',
                }
            }
        },

        stickyActionColumn: {
            enableSticky: true,
            muiTableHeadCellProps: {
                sx: {
                    position: 'sticky',
                    right: 0,
                    zIndex: 3,
                    background: headerBackgroundColor,
                    borderLeft: `1px solid ${borderColor}`,
                    borderRight: `1px solid ${borderColor}`,
                    borderBottom: `1px solid ${borderColor}`,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 2px',
                    lineHeight: '1.1',
                    color: headerTextColor,
                    '& > div': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        color: headerTextColor,
                    }
                }
            },
            muiTableBodyCellProps: {
                sx: {
                    position: 'sticky',
                    right: 0,
                    zIndex: 3,
                    background: backgroundColor,
                    borderLeft: `1px solid ${borderColor}`,
                    borderRight: `1px solid ${lightBorderColor}`,
                    borderBottom: `1px solid ${lightBorderColor}`,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px 2px',
                    lineHeight: '1.1',
                    color: textColor,
                    '&:last-child': {
                        borderBottom: `1px solid ${lightBorderColor}`,
                    }
                }
            }
        },

        selectColumn: {
            muiTableHeadCellProps: {
                sx: {
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 2px',
                    borderRight: `1px solid ${borderColor}`,
                    borderBottom: `1px solid ${borderColor}`,
                    lineHeight: '1.1',
                    color: headerTextColor,
                    backgroundColor: headerBackgroundColor,
                }
            },
            muiTableBodyCellProps: {
                sx: {
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px 2px',
                    borderRight: `1px solid ${lightBorderColor}`,
                    borderBottom: `1px solid ${lightBorderColor}`,
                    lineHeight: '1.1',
                    color: textColor,
                    '&:last-child': {
                        borderBottom: `1px solid ${lightBorderColor}`,
                    }
                }
            }
        }
    };
};