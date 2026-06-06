'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Collapse from '@mui/material/Collapse';
import { styled, useTheme } from '@mui/material/styles';
import { varAlpha } from 'minimal-shared/utils';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

const SelectField = styled(Box)(({ theme, error }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1.5),
    border: `1px solid ${error ? theme.vars.palette.error.main : theme.vars.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.vars.palette.background.paper,
    cursor: 'pointer',
    transition: theme.transitions.create(['border-color', 'box-shadow'], {
        duration: theme.transitions.duration.shorter,
    }),
    '&:hover': { borderColor: theme.vars.palette.text.primary },
    '&.Mui-focused': {
        borderColor: theme.vars.palette.primary.main,
        boxShadow: `0 0 0 2px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.2)}`,
    },
}));

const DropdownContent = styled(Box)(({ theme }) => ({
    width: 340,
    maxHeight: 420,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.vars.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.vars.customShadows.dropdown,
    overflow: 'hidden',
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.vars.palette.divider}`,
}));

const TreeViewWrapper = styled('div')(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(1),
    maxHeight: 320,
}));

const bulletSvg = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='14' fill='none' viewBox='0 0 20 14'%3E%3Crect x='0' y='6' width='20' height='2' rx='1' fill='%23efefef'/%3E%3C/svg%3E"`;
// ----------------------------------------------------------------------

function TreeItem({ node, depth = 0, selectedId, onSelect, searchQuery, searchMode }) {
    const theme = useTheme();
    const isRtl = theme.direction === 'rtl';
    const isLtr = theme.direction === 'ltr'
    const [isExpanded, setIsExpanded] = useState(depth === 0);

    const hasChildren = node.children?.length > 0;
    const isSelected = selectedId === node.id;
    const isUnit = node.type === 'unit';

    const shouldShow = useMemo(() => {
        if (!searchQuery || searchMode !== 'filter') return true;
        const matchInNode = node.label.toLowerCase().includes(searchQuery.toLowerCase());
        const matchInChildren = node.children?.some(child =>
            child.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchInNode || matchInChildren;
    }, [node, searchQuery, searchMode]);

    useEffect(() => {
        if (searchQuery && searchMode === 'filter') {
            const hasMatchingChild = node.children?.some(child =>
                child.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (hasMatchingChild && !isExpanded) setIsExpanded(true);
        }
    }, [searchQuery, node.children, searchMode]);

    if (!shouldShow) return null;

    const handleExpandClick = (e) => {
        e.stopPropagation();
        if (hasChildren) setIsExpanded(!isExpanded);
    };

    const handleSelectClick = () => {
        if (isUnit) onSelect(node.id, node);
    };

    const getLabel = () => {
        if (!searchQuery || searchMode !== 'highlight') return node.label;
        const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = node.label.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} style={{ backgroundColor: '#ffeb3b', padding: 0 }}>{part}</mark> : part
        );
    };

    let expandIcon = 'eva:arrow-ios-forward-fill';
    if (hasChildren) {
        expandIcon = isExpanded
            ? 'eva:arrow-ios-downward-fill'
            : (isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill');
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    py: 0.75,
                    pr: 1,
                    pl: depth > 0 ? 4 : 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: theme.vars.palette.action.hover },
                    ...(isSelected && {
                        backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                        '& .label': { color: theme.vars.palette.primary.main, fontWeight: 600 },
                    }),
                    ...(depth > 0 && {
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 28,
                            height: 8,
                            backgroundColor: theme.vars.palette.primary.main,
                            mask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
                            WebkitMask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            ...(isRtl && { right: 'auto', left: 0 }),
                            ...(isLtr && { left: 0, right: 'auto' }),
                            ...theme.applyStyles('dark', {
                                backgroundColor: theme.vars.palette.primary.light,
                            }),
                        },
                    }),

                    '& .label': {
                        flex: 1,
                        ...((depth === 0 || depth === 1) && {
                            fontSize: '0.95rem',
                            fontWeight: 700,
                        }),
                        ...(depth > 1 && {
                            fontSize: '0.85rem',
                            fontWeight: 400,
                        }),
                    },
                }}
                onClick={handleSelectClick}
            >
                {hasChildren ? (
                    <Box
                        onClick={handleExpandClick}
                        sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Iconify icon={expandIcon} width={18} />
                    </Box>
                ) : (
                    <Box sx={{ width: 0 }} />
                )}

                {isUnit && <Checkbox checked={isSelected} onChange={handleSelectClick} size="small" sx={{ p: 0.5 }} />}

                <Box className="label" sx={{ flex: 1, ...theme.typography.body2 }}>
                    {getLabel()}
                </Box>
            </Box>

            {hasChildren && (
                <Collapse in={isExpanded} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            position: 'relative',
                            ...(isRtl && { mr: 0, ml: 2.5 }),
                            ...(isLtr && { ml: 2.5, mr: 0 }),
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: 3,
                                backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 1),
                                borderRadius: 1,
                                top: 0,
                                bottom: 18,
                                ...(isRtl && { right: 'auto', left: 0 }),
                                ...(isLtr && { left: 0, right: 'auto' }),
                            },
                        }}
                    >
                        {node.children.map((child) => (
                            <TreeItem
                                key={child.id}
                                node={child}
                                depth={depth + 1}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                searchQuery={searchQuery}
                                searchMode={searchMode}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
}

// ----------------------------------------------------------------------

export function DropdownTreeSelect({
    data = [],
    value = null,
    onChange,
    placeholder = 'انتخاب کنید...',
    searchPlaceholder = 'جستجو...',
    searchMode = 'filter',
    disabled = false,
    error = false,
    helperText = '',
    sx = {},
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const open = Boolean(anchorEl);

    const handleOpen = (e) => { if (!disabled) setAnchorEl(e.currentTarget); };
    const handleClose = () => { setAnchorEl(null); setSearchQuery(''); };

    const handleSelect = useCallback((id, node) => {
        onChange?.(id, node);
        handleClose();
    }, [onChange]);

    const findLabel = useCallback((items, id) => {
        for (const item of items) {
            if (item.id === id) return item.label;
            if (item.children) {
                const found = findLabel(item.children, id);
                if (found) return found;
            }
        }
        return '';
    }, []);

    const selectedLabel = value ? findLabel(data, value) : '';

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <SelectField error={error} onClick={handleOpen} className={open ? 'Mui-focused' : ''}>
                <Box sx={{ color: selectedLabel ? 'text.primary' : 'text.disabled' }}>{selectedLabel || placeholder}</Box>
                <Iconify icon="eva:arrow-ios-downward-fill" width={18} />
            </SelectField>

            {helperText && (
                <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: error ? 'error.main' : 'text.secondary' }}>
                    {helperText}
                </Box>
            )}

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { sx: { mt: 0.5, boxShadow: 'none', bgcolor: 'transparent' } } }}
            >
                <DropdownContent>
                    <SearchWrapper>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" width={18} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                                            <Iconify icon="eva:close-fill" width={16} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </SearchWrapper>

                    <TreeViewWrapper>
                        {data.map((node) => (
                            <TreeItem
                                key={node.id}
                                node={node}
                                depth={0}
                                selectedId={value}
                                onSelect={handleSelect}
                                searchQuery={searchQuery}
                                searchMode={searchMode}
                            />
                        ))}
                    </TreeViewWrapper>
                </DropdownContent>
            </Popover>
        </Box>
    );
}