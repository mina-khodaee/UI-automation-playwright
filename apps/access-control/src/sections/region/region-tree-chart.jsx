
import { OrgChart } from 'd3-org-chart';
import ReactDOMServer from 'react-dom/server';
import { varAlpha } from 'minimal-shared/utils';
import React, { useLayoutEffect, useRef } from 'react';

import { useTheme } from '@mui/material';

// ----------------------------------------------------------------------

export function RegionTreeChart(props) {
    const d3Container = useRef(null);
    const chartRef = useRef(new OrgChart());
    const theme = useTheme();
    const NodeContent = ({ data, bgColor }) => (
        <div style={{ height: '100%' }}>
            <div style={{
                fontFamily: 'IRANSansWeb',
                padding: '8px 15px 3px 15px ',
                backgroundColor: bgColor,
                borderRadius: '10px',
                border: '1px solid #E4E2E9',
                position: 'relative',
                direction: 'rtl',
                height: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    color: '#08011E',
                    marginTop: '2px'
                }}>
                    {data.data.name}
                </div>

                <div style={{
                    fontSize: '11px',
                    color: '#716E7B',
                    marginTop: '15px'
                }}>
                    توضیحات:
                </div>
                <div style={{
                    color: '#08011E',
                    fontSize: '12px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }}>
                    {data.data.description}
                </div>
            </div>
        </div>
    );

    useLayoutEffect(() => {
        if (props.data && d3Container.current) {
            chartRef.current
                .nodeHeight((d) => 85 + 25)
                .nodeWidth((d) => 210 + 2)
                .childrenMargin((d) => 50)
                .compactMarginBetween((d) => 35)
                .compactMarginPair((d) => 30)
                .neighbourMargin((a, b) => 20)
                .onNodeClick((d, i, arr) => {
                    props.onNodeClick(d.data.id);
                })
                .nodeContent(function (data, i, arr, state) {
                    const bgColor = varAlpha(theme.vars.palette.primary.darkerChannel, 0.3)
                    return ReactDOMServer.renderToStaticMarkup(
                        <NodeContent data={data} bgColor={bgColor} />
                    );
                })
                .container(d3Container.current)
                .data(props.data)
                .render();
        }
    }, [props.data, d3Container.current]); // Only run this effect once mounted and data is available

    return (
        <div ref={d3Container} />
    );
}
