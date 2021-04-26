import React, { useContext } from 'react';
import { PatternLines } from '@visx/pattern';
import { DataContext } from '@visx/xychart';
import { LinearGradient } from '@visx/gradient';

const patternId = 'xy-chart-pattern';

export default function CustomChartBackground() {
  const {
    theme, margin, width, height, innerWidth, innerHeight,
  } = useContext(DataContext);

  // early return values not available in context
  if (width == null || height == null || margin == null || theme == null) return null;

  return (
    <>
      <LinearGradient from="#efefef" to="#efefef" id="seller-dash" />
      <PatternLines
        id={patternId}
        width={16}
        height={16}
        orientation={['diagonal']}
        stroke={theme?.gridStyles?.stroke}
        strokeWidth={1}
      />
      <rect x={0} y={0} width={width} height={height} fill="url('#seller-dash')" />
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill={`url(#${patternId})`}
        fillOpacity={0.3}
      />
    </>
  );
}
