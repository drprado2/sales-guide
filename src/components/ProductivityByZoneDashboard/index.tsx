import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip, darkTheme, AnimatedAreaStack, AreaSeries,
} from '@visx/xychart';
import { withParentSize } from '@visx/responsive';
import React from 'react';
import { WithParentSizeProps, WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';
import CustomChartBackground from './CustomChartBackground';
import './styles.scss';

const data1 = [
  { x: '2020-01-01', y: 50, name: 'Região Sul' },
  { x: '2020-01-02', y: 10, name: 'Região Sul' },
  { x: '2020-01-03', y: 23, name: 'Região Sul' },
  { x: '2020-01-04', y: 16, name: 'Região Sul' },
  { x: '2020-01-05', y: 18, name: 'Região Sul' },
];

const data2 = [
  { x: '2020-01-01', y: 30, name: 'Região Norte' },
  { x: '2020-01-02', y: 40, name: 'Região Norte' },
  { x: '2020-01-03', y: 80, name: 'Região Norte' },
  { x: '2020-01-04', y: 26, name: 'Região Norte' },
  { x: '2020-01-05', y: 48, name: 'Região Norte' },
];

const data3 = [
  { x: '2020-01-01', y: 8, name: 'Região Leste' },
  { x: '2020-01-02', y: 12, name: 'Região Leste' },
  { x: '2020-01-03', y: 4, name: 'Região Leste' },
  { x: '2020-01-04', y: 9, name: 'Região Leste' },
  { x: '2020-01-05', y: 14, name: 'Região Leste' },
];

const data4 = [
  { x: '2020-01-01', y: 18, name: 'Região Oeste' },
  { x: '2020-01-02', y: 22, name: 'Região Oeste' },
  { x: '2020-01-03', y: 14, name: 'Região Oeste' },
  { x: '2020-01-04', y: 19, name: 'Região Oeste' },
  { x: '2020-01-05', y: 24, name: 'Região Oeste' },
];

const data5 = [
  { x: '2020-01-01', y: 18, name: 'Região Suldeste' },
  { x: '2020-01-02', y: 52, name: 'Região Suldeste' },
  { x: '2020-01-03', y: 4, name: 'Região Suldeste' },
  { x: '2020-01-04', y: 9, name: 'Região Suldeste' },
  { x: '2020-01-05', y: 34, name: 'Região Suldeste' },
];

const data6 = [
  { x: '2020-01-01', y: 8, name: 'Região Noroeste' },
  { x: '2020-01-02', y: 22, name: 'Região Noroeste' },
  { x: '2020-01-03', y: 34, name: 'Região Noroeste' },
  { x: '2020-01-04', y: 99, name: 'Região Noroeste' },
  { x: '2020-01-05', y: 24, name: 'Região Noroeste' },
];

const datas = [
  data1, data2, data3, data4, data5, data6,
];

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

const ProductivityByZoneDashboard : React.FC<WithParentSizeProps & WithParentSizeProvidedProps> = ({
  parentWidth = 10,
  parentHeight = 10,
}) => (
  <div id="sellers-active">
    <h2>Produtividade por Região</h2>
    <XYChart theme={darkTheme} height={parentHeight} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
      <CustomChartBackground />
      <AnimatedAxis orientation="bottom" />
      <AnimatedAxis numTicks={6} label="Total" orientation="right" />
      <AnimatedGrid columns={false} numTicks={4} />
      <AnimatedAreaStack>
        {
          datas.map((d) => (
            <AreaSeries
              dataKey={d[0].name}
              data={d}
              {...accessors}
              fillOpacity={0.4}
            />
          ))
        }
      </AnimatedAreaStack>
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale ? colorScale(tooltipData?.nearestDatum?.key ?? '#000') : undefined }}>
              {tooltipData?.nearestDatum?.key}
            </div>
            {accessors.xAccessor(tooltipData?.nearestDatum?.datum)}
            {', '}
            {accessors.yAccessor(tooltipData?.nearestDatum?.datum)}
          </div>
        )}
      />
    </XYChart>
  </div>
);

export default withParentSize(ProductivityByZoneDashboard);
