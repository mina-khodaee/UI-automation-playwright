
'use client';

import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

const TreeViewContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    overflow: 'auto',
    maxHeight: '70vh',
    backgroundColor: theme.palette.background.default,
}));

const bulletSvg = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='14' fill='none' viewBox='0 0 20 14'%3E%3Crect x='0' y='6' width='20' height='2' rx='1' fill='%23efefef'/%3E%3C/svg%3E"`;

function TreeNode({ node, depth = 0, searchTerm, searchMode }) {
    const theme = useTheme();
    const isRtl = theme.direction === 'rtl';
    const isLtr = theme.direction === 'ltr';
    const [isExpanded, setIsExpanded] = useState(depth === 0);
    const hasChildren = node.children && node.children.length > 0;

    const getNodeColor = () => {
        switch (node.type) {
            case 'site': return theme.palette.primary.main;
            case 'unit': return theme.palette.info.main;
            case 'person': return theme.palette.success.main;
            default: return theme.palette.text.primary;
        }
    };

    const matchesSearch = useMemo(() => {
        if (!searchTerm) return false;
        const term = searchTerm.toLowerCase();
        if (node.label.toLowerCase().includes(term)) return true;
        if (node.children) {
            return node.children.some(child =>
                child.label.toLowerCase().includes(term) ||
                (child.children && child.children.some(grand => grand.label.toLowerCase().includes(term)))
            );
        }
        return false;
    }, [node, searchTerm]);

    useEffect(() => {
        if (searchTerm && matchesSearch && !isExpanded) {
            setIsExpanded(true);
        }
    }, [searchTerm, matchesSearch, isExpanded]);

    const shouldShow = useMemo(() => {
        if (!searchTerm || searchMode !== 'filter') return true;
        const term = searchTerm.toLowerCase();
        const matchInNode = node.label.toLowerCase().includes(term);
        const matchInChildren = node.children?.some(child =>
            child.label.toLowerCase().includes(term) ||
            (child.children && child.children.some(grand => grand.label.toLowerCase().includes(term)))
        );
        return matchInNode || matchInChildren;
    }, [node, searchTerm, searchMode]);

    if (!shouldShow) return null;

    const handleExpandClick = (e) => {
        e.stopPropagation();
        if (hasChildren) setIsExpanded(!isExpanded);
    };

    const getHighlightedLabel = () => {
        if (!searchTerm || searchMode !== 'highlight') return node.label;
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = node.label.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} style={{ backgroundColor: '#ffeb3b', padding: 0 }}>{part}</mark> : part
        );
    };

    const nodeColor = getNodeColor();
    const expandIcon = hasChildren
        ? (isExpanded ? 'eva:arrow-ios-downward-fill' : (isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'))
        : null;

    return (
        <Box sx={{ mb: 0.5 }}>
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
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                    ...(depth > 0 && {
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 28,
                            height: 8,
                            backgroundColor: nodeColor,
                            mask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
                            WebkitMask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            ...(isRtl && { right: 'auto', left: 0 }),
                            ...(isLtr && { left: 0, right: 'auto' }),
                        },
                    }),
                    '& .label': {
                        flex: 1,
                        color: nodeColor,
                        fontWeight: node.type === 'site' ? 800 : 600,
                        fontSize: node.type === 'site' ? '0.95rem' : '0.85rem',
                    },
                }}
            >
                {hasChildren ? (
                    <Box
                        onClick={handleExpandClick}
                        sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', mr: 0.5 }}
                    >
                        <Iconify icon={expandIcon} width={18} color={theme.palette.text.secondary} />
                    </Box>
                ) : (
                    <Box sx={{ width: 24, mr: 0.5 }} />
                )}

                <Iconify
                    icon={node.type === 'site' ? 'eva:building-outline' : (node.type === 'unit' ? 'eva:folder-outline' : 'eva:person-outline')}
                    width={18}
                    sx={{ color: nodeColor, mr: 1 }}
                />

                <Box className="label">{getHighlightedLabel()}</Box>

                {node.type === 'person' && node.data?.position?.name && (
                    <Box component="span" sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary, ml: 1 }}>
                        ({node.data.position.name})
                    </Box>
                )}
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
                                width: 2,
                                backgroundColor: alpha(nodeColor, 0.4),
                                borderRadius: 1,
                                top: 0,
                                bottom: 18,
                                ...(isRtl && { right: 'auto', left: 0 }),
                                ...(isLtr && { left: 0, right: 'auto' }),
                            },
                        }}
                    >
                        {node.children.map((child) => (
                            <TreeNode
                                key={child.id}
                                node={child}
                                depth={depth + 1}
                                searchTerm={searchTerm}
                                searchMode={searchMode}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
}

export function SimpleTreeView({ data, searchTerm = '', searchMode = 'highlight' }) {
    if (!data) return null;
    const rootChildren = data.id === 'root' ? data.children : [data];
    return (
        <TreeViewContainer>
            {rootChildren.map((node) => (
                <TreeNode key={node.id} node={node} depth={0} searchTerm={searchTerm} searchMode={searchMode} />
            ))}
        </TreeViewContainer>
    );
}