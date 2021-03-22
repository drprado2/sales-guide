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
  { x: '2020-01-01', y: 50, name: 'Adriano Oliveira' },
  { x: '2020-01-02', y: 10, name: 'Adriano Oliveira' },
  { x: '2020-01-03', y: 23, name: 'Adriano Oliveira' },
  { x: '2020-01-04', y: 16, name: 'Adriano Oliveira' },
  { x: '2020-01-05', y: 18, name: 'Adriano Oliveira' },
];

const data2 = [
  { x: '2020-01-01', y: 30, name: 'Claudio Santos' },
  { x: '2020-01-02', y: 40, name: 'Claudio Santos' },
  { x: '2020-01-03', y: 80, name: 'Claudio Santos' },
  { x: '2020-01-04', y: 26, name: 'Claudio Santos' },
  { x: '2020-01-05', y: 48, name: 'Claudio Santos' },
];

const data3 = [
  { x: '2020-01-01', y: 8, name: 'Renata Dionizio' },
  { x: '2020-01-02', y: 12, name: 'Renata Dionizio' },
  { x: '2020-01-03', y: 4, name: 'Renata Dionizio' },
  { x: '2020-01-04', y: 9, name: 'Renata Dionizio' },
  { x: '2020-01-05', y: 14, name: 'Renata Dionizio' },
];

const data4 = [
  { x: '2020-01-01', y: 18, name: 'Pedro Augusto' },
  { x: '2020-01-02', y: 22, name: 'Pedro Augusto' },
  { x: '2020-01-03', y: 14, name: 'Pedro Augusto' },
  { x: '2020-01-04', y: 19, name: 'Pedro Augusto' },
  { x: '2020-01-05', y: 24, name: 'Pedro Augusto' },
];

const data5 = [
  { x: '2020-01-01', y: 18, name: 'Alice Silva' },
  { x: '2020-01-02', y: 52, name: 'Alice Silva' },
  { x: '2020-01-03', y: 4, name: 'Alice Silva' },
  { x: '2020-01-04', y: 9, name: 'Alice Silva' },
  { x: '2020-01-05', y: 34, name: 'Alice Silva' },
];

const data6 = [
  { x: '2020-01-01', y: 8, name: 'Raquel de Oliveira' },
  { x: '2020-01-02', y: 22, name: 'Raquel de Oliveira' },
  { x: '2020-01-03', y: 34, name: 'Raquel de Oliveira' },
  { x: '2020-01-04', y: 99, name: 'Raquel de Oliveira' },
  { x: '2020-01-05', y: 24, name: 'Raquel de Oliveira' },
];

const data7 = [
  { x: '2020-01-01', y: 58, name: 'Lucas Augusto' },
  { x: '2020-01-02', y: 22, name: 'Lucas Augusto' },
  { x: '2020-01-03', y: 34, name: 'Lucas Augusto' },
  { x: '2020-01-04', y: 9, name: 'Lucas Augusto' },
  { x: '2020-01-05', y: 124, name: 'Lucas Augusto' },
];

const data8 = [
  { x: '2020-01-01', y: 38, name: 'Laura Dionizio' },
  { x: '2020-01-02', y: 12, name: 'Laura Dionizio' },
  { x: '2020-01-03', y: 31, name: 'Laura Dionizio' },
  { x: '2020-01-04', y: 49, name: 'Laura Dionizio' },
  { x: '2020-01-05', y: 24, name: 'Laura Dionizio' },
];

const data9 = [
  { x: '2020-01-01', y: 18, name: 'Daniel Ramires' },
  { x: '2020-01-02', y: 32, name: 'Daniel Ramires' },
  { x: '2020-01-03', y: 11, name: 'Daniel Ramires' },
  { x: '2020-01-04', y: 69, name: 'Daniel Ramires' },
  { x: '2020-01-05', y: 44, name: 'Daniel Ramires' },
];

const data10 = [
  { x: '2020-01-01', y: 8, name: 'Paula Pinto' },
  { x: '2020-01-02', y: 12, name: 'Paula Pinto' },
  { x: '2020-01-03', y: 1, name: 'Paula Pinto' },
  { x: '2020-01-04', y: 9, name: 'Paula Pinto' },
  { x: '2020-01-05', y: 14, name: 'Paula Pinto' },
];

const datas = [
  data1, data2, data3, data4, data5, data6, data7, data8, data9, data10,
];

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

const SellersActiveDashboard : React.FC<WithParentSizeProps & WithParentSizeProvidedProps> = ({
  parentWidth = 10,
  parentHeight = 10,
}) => (
  <div id="sellers-active">
    <h2>Atividades Vendedores</h2>
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

export default withParentSize(SellersActiveDashboard);
