'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from '@repo/ui/components-settings';
import { Box, CircularProgress } from '@mui/material';
import { OrgChart } from './d3-org-chart';
import { flattenOrgTree } from '@repo/ui/utils';

export const D3OrgChartWrapper = forwardRef(({ data, onNodeClick }, ref) => {
    const theme = useTheme();
    const settings = useSettingsContext();
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const currentDataRef = useRef(data);
    const currentFlatDataRef = useRef([]);

    const direction = settings.state.direction || 'rtl';
    const layoutDir = direction === 'rtl' ? 'right' : 'left';

    const themeKey = useMemo(() => ({
        mode: theme.palette.mode,
        primary: theme.palette.primary.main,
        primaryDark: theme.palette.primary.dark,
        backgroundPaper: theme.palette.background.paper,
        backgroundDefault: theme.palette.background.default,
        textPrimary: theme.palette.text.primary,
        textSecondary: theme.palette.text.secondary,
        divider: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        successMain: theme.palette.success.main,
        shadow: theme.shadows[1],
    }), [theme]);

    const adjustSize = useCallback(() => {
        if (!containerRef.current || !chartRef.current) return;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;
        const centerGroup = svg.querySelector('.center-group');
        if (!centerGroup) return;
        const bbox = centerGroup.getBBox();
        const padding = 60;
        const MIN_HEIGHT = 700;
        const calculatedHeight = bbox.y + bbox.height + padding;
        const newHeight = Math.max(calculatedHeight, MIN_HEIGHT);
        const currentHeight = parseInt(svg.getAttribute('height'), 10);
        if (Math.abs(currentHeight - newHeight) > 5) {
            chartRef.current.svgHeight(newHeight);
            chartRef.current.render();
        }
    }, []);

    useImperativeHandle(ref, () => ({
        searchNodes: (searchTerm) => {
            if (!chartRef.current) return;
            if (!searchTerm || searchTerm.trim() === '') {
                chartRef.current.clearHighlighting();
                chartRef.current.render();
                requestAnimationFrame(() => adjustSize());
                return;
            }
            const term = searchTerm.trim().toLowerCase();
            const flatData = currentFlatDataRef.current;
            const matchedNodes = flatData.filter(item => {
                const name = (item.name || '').toLowerCase();
                const firstName = (item.originalData?.firstName || '').toLowerCase();
                const lastName = (item.originalData?.lastName || '').toLowerCase();
                const personnelCode = (item.originalData?.personnelCode || '').toLowerCase();
                const position = (item.originalData?.position?.name || '').toLowerCase();
                const unitName = (item.originalData?.unit?.name || '').toLowerCase();
                const siteName = (item.originalData?.site?.name || '').toLowerCase();
                const siteNameFromType = item.type === 'site' ? name : '';
                return name.includes(term) || firstName.includes(term) || lastName.includes(term) ||
                    personnelCode.includes(term) || position.includes(term) || unitName.includes(term) ||
                    siteName.includes(term) || siteNameFromType.includes(term);
            });
            if (matchedNodes.length === 0) return;
            chartRef.current.clearHighlighting();
            matchedNodes.forEach(node => {
                let parentId = node.parentId;
                while (parentId) {
                    chartRef.current.setExpanded(parentId, true);
                    const parentNode = flatData.find(n => n.id === parentId);
                    parentId = parentNode ? parentNode.parentId : null;
                }
                chartRef.current.setHighlighted(node.id);
            });
            chartRef.current.render();
            requestAnimationFrame(() => adjustSize());
            setTimeout(() => {
                chartRef.current.setCentered(matchedNodes[0].id);
                chartRef.current.render();
                requestAnimationFrame(() => adjustSize());
            }, 100);
        },
        clearSearch: () => {
            if (chartRef.current) {
                chartRef.current.clearHighlighting();
                chartRef.current.render();
                requestAnimationFrame(() => adjustSize());
            }
        },
        getChart: () => chartRef.current,
    }));

    useEffect(() => {
        if (!containerRef.current || !data) return;
        currentDataRef.current = data;
        if (chartRef.current) chartRef.current.clear();
        const flatData = flattenOrgTree(data);
        currentFlatDataRef.current = flatData;
        if (flatData.length === 0) {
            setLoading(false);
            return;
        }

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const chart = new OrgChart()
            .container(containerRef.current)
            .data(flatData)
            .nodeId((d) => d.id)
            .parentNodeId((d) => d.parentId)
            .svgWidth(width)
            .svgHeight(height)
            .setActiveNodeCentered(false)
            .nodeWidth(() => 160)
            .nodeHeight((node) => (node.data.type === 'person' ? 70 : 50))
            .layout(layoutDir)
            .compact(false)
            .scaleExtent([0.1, 2])
            .duration(600)
            .defaultFont(themeKey.fontFamily)
            .nodeContent((node) => {
                const { type, originalData, name } = node.data;
                if (type === 'site') {
                    return `
            <div style="display: flex; align-items: center; justify-content: center; padding: 12px 16px; background: linear-gradient(135deg, ${themeKey.primary}, ${themeKey.primaryDark}); border-radius: ${themeKey.borderRadius}px; color: white; font-weight: bold; font-size: 0.875rem; text-align: center; height: 100%; box-sizing: border-box; direction: ${direction}; box-shadow: ${themeKey.shadow};">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-${direction === 'rtl' ? 'left' : 'right'}: 8px;">
                <path d="M19 15h-2v-2h2v2zm0 4h-2v-2h2v2zm-4-4h-2v-2h2v2zm0 4h-2v-2h2v2zm-4-4H9v-2h2v2zm0 4H9v-2h2v2zm-4-4H5v-2h2v2zm0 4H5v-2h2v2zM21 5H3v16h18V5z"/>
              </svg>
              <span>${name}</span>
            </div>
          `;
                }
                if (type === 'person') {
                    const fullName = (originalData?.firstName && originalData?.lastName) ? `${originalData.firstName} ${originalData.lastName}` : name;
                    const positionName = originalData?.position?.name || '';
                    const firstLetter = fullName ? fullName.charAt(0) : '?';
                    return `
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${themeKey.backgroundPaper}; border-radius: ${themeKey.borderRadius * 2}px; box-shadow: ${themeKey.shadow}; border: 1px solid ${themeKey.divider}; height: 100%; box-sizing: border-box; direction: ${direction};">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: ${themeKey.successMain}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">${firstLetter}</div>
              <div style="flex: 1; text-align: ${direction === 'rtl' ? 'right' : 'left'};">
                <div style="font-weight: 700; font-size: 0.85rem; color: ${themeKey.textPrimary};">${fullName}</div>
                ${positionName ? `<div style="font-size: 0.7rem; color: ${themeKey.successMain}; margin-top: 4px;">${positionName}</div>` : ''}
              </div>
            </div>
          `;
                }
                return `
          <div style="padding: 12px; background: ${themeKey.mode === 'dark' ? '#2a2a2a' : '#f5f5f5'}; border-radius: ${themeKey.borderRadius}px; text-align: ${direction === 'rtl' ? 'right' : 'center'}; font-size: 0.8rem; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 500; color: ${themeKey.textPrimary}; direction: ${direction};">
            ${name}
          </div>
        `;
            })
            // eslint-disable-next-line func-names
            .nodeUpdate(function () {
                d3.select(this).select('.node-rect')
                    .attr('rx', themeKey.borderRadius)
                    .attr('stroke', themeKey.divider)
                    .attr('stroke-width', 1)
                    .attr('fill', 'transparent');
            })
            .onNodeClick((node) => {
                if (onNodeClick) onNodeClick(node.data);
            });

        chartRef.current = chart;
        chart.render();
        setLoading(false);

        const updateSize = () => {
            if (!containerRef.current || !chartRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            chartRef.current.svgWidth(newWidth);
            chartRef.current.render();
            requestAnimationFrame(() => adjustSize());
        };

        const resizeObserver = new ResizeObserver(() => updateSize());
        resizeObserver.observe(containerRef.current);
        window.addEventListener('resize', updateSize);

        requestAnimationFrame(() => adjustSize());

        // eslint-disable-next-line consistent-return
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateSize);
            if (chartRef.current) chartRef.current.clear();
        };
    }, [data, onNodeClick, direction, themeKey, layoutDir, adjustSize]);

    return (
        <Box ref={containerRef} sx={{ width: '100%', height: 'auto', position: 'relative' }}>
            {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
        </Box>
    );
});

D3OrgChartWrapper.displayName = 'D3OrgChartWrapper';