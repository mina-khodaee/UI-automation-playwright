'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { styled, useTheme } from '@mui/material/styles';
import { Iconify } from '../iconify';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3, 2),
    overflowX: 'auto',
    background: theme.vars.palette.background.default,
    minHeight: '70vh',
}));

const TreeContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
});

const RootNode = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 3),
    backgroundColor: theme.vars.palette.primary.main,
    color: '#fff',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: '0.9rem',
}));

const VerticalLine = styled(Box)(({ theme }) => ({
    width: 2,
    height: 30,
    backgroundColor: theme.vars.palette.grey[400],
    margin: '4px 0',
}));

const NodesRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(4),
    flexWrap: 'wrap',
    position: 'relative',
}));

const NodeCard = styled(Box)(({ theme, isChild = false }) => ({
    width: 200,
    backgroundColor: isChild ? theme.vars.palette.background.paper : theme.vars.palette.grey[100],
    border: `1px solid ${theme.vars.palette.grey[300]}`,
    borderRadius: 6,
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
        borderColor: theme.vars.palette.grey[500],
    },
}));

const NodeIcon = styled(Box)(({ theme, iconColor = 'primary' }) => ({
    width: 32,
    height: 32,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.vars.palette[iconColor].main,
    color: '#fff',
}));

const NodeLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.8rem',
    lineHeight: 1.3,
    flex: 1,
}));

const ExpandIcon = styled(Iconify)(({ theme, expanded }) => ({
    width: 18,
    height: 18,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    transform: expanded ? 'rotate(180deg)' : 'none',
    color: theme.vars.palette.text.secondary,
    '&:hover': { color: theme.vars.palette.primary.main },
}));

// ----------------------------------------------------------------------
// کامپوننت برای نمایش یک گروه از فرزندان با خط افقی مشترک
function ChildrenGroup({ children, onToggle, expandedNodes, depth }) {
    if (!children?.length) return null;

    return (
        <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
            {/* خط افقی که همه فرزندان را به هم وصل می‌کند */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -12,
                    left: '10%',
                    right: '10%',
                    height: 2,
                    backgroundColor: '#9e9e9e',
                    zIndex: 0,
                }}
            />
            {/* خط عمودی از وسط خط افقی به سمت پایین (به کارت‌ها) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 2,
                    height: 12,
                    backgroundColor: '#9e9e9e',
                    zIndex: 0,
                }}
            />

            <NodesRow>
                {children.map((child) => (
                    <Box key={child.id} sx={{ position: 'relative', zIndex: 1 }}>
                        {/* خط عمودی از خط افقی تا هر کارت فرزند */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -12,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 2,
                                height: 12,
                                backgroundColor: '#9e9e9e',
                            }}
                        />
                        <OrgTreeNode
                            node={child}
                            depth={depth + 1}
                            onToggle={onToggle}
                            expandedNodes={expandedNodes}
                        />
                    </Box>
                ))}
            </NodesRow>
        </Box>
    );
}

// ----------------------------------------------------------------------

function OrgTreeNode({ node, depth = 0, onToggle, expandedNodes }) {
    const hasChildren = node.children?.length > 0;
    const isExpanded = expandedNodes?.includes(node.id) || depth === 0;
    const isSite = node.type === 'site';
    const isUnit = node.type === 'unit';

    const getIcon = () => {
        if (isSite) return 'eva:building-outline';
        if (isUnit) return 'eva:folder-outline';
        return 'eva:person-outline';
    };

    const getColor = () => {
        if (isSite) return 'primary';
        if (isUnit) return 'info';
        return 'success';
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        if (hasChildren) onToggle(node.id, !isExpanded);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NodeCard isChild={depth > 0}>
                <NodeIcon iconColor={getColor()}>
                    <Iconify icon={getIcon()} width={18} />
                </NodeIcon>
                <NodeLabel variant="body2">{node.label}</NodeLabel>
                {hasChildren && <ExpandIcon icon="eva:arrow-ios-downward-fill" expanded={isExpanded} onClick={handleToggle} />}
            </NodeCard>

            {hasChildren && isExpanded && (
                <ChildrenGroup children={node.children} onToggle={onToggle} expandedNodes={expandedNodes} depth={depth} />
            )}
        </Box>
    );
}

// ----------------------------------------------------------------------

export function FinalOfficialOrgChart({ data }) {
    const [expandedNodes, setExpandedNodes] = useState([]);

    const handleToggle = useCallback((nodeId, isExpanded) => {
        setExpandedNodes((prev) =>
            isExpanded ? [...prev, nodeId] : prev.filter((id) => id !== nodeId)
        );
    }, []);

    if (!data?.children?.length) {
        return (
            <Container>
                <Typography align="center" color="text.secondary">داده‌ای وجود ندارد</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <TreeContainer>
                <RootNode>
                    <Iconify icon="eva:home-outline" width={18} />
                    <Typography variant="subtitle2">{data.label || 'سازمان مرکزی'}</Typography>
                </RootNode>
                <VerticalLine />

                {/* گروه فرزندان سطح اول (سایت‌ها) */}
                <ChildrenGroup children={data.children} onToggle={handleToggle} expandedNodes={expandedNodes} depth={0} />
            </TreeContainer>
        </Container>
    );
}