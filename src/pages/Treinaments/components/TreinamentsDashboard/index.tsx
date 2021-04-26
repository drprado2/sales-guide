import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip, darkTheme, AnimatedAreaStack, AreaSeries, buildChartTheme,
} from '@visx/xychart';
import { withParentSize } from '@visx/responsive';
import React from 'react';
import { WithParentSizeProps, WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';
import CustomChartBackground from './CustomChartBackground';
import './styles.scss';

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

const customTheme = buildChartTheme({
  backgroundColor: 'white',
  colors: ['#9ccc65', '#ef5350'],
  gridColor: '#336d88',
  gridColorDark: '#1d1b38',
  svgLabelBig: { fill: '#1d1b38' },
  tickLength: 8,
});

export interface TreinamnetDashboardData {
  x: string;
  y: number;
  label: string;
}

interface Props {
  approveds: Array<TreinamnetDashboardData>;
  reproveds: Array<TreinamnetDashboardData>;
}

const TreinamentsDashboard : React.FC<WithParentSizeProps & WithParentSizeProvidedProps & Props> = ({
  parentWidth = 10,
  parentHeight = 10,
  approveds,
  reproveds,
}) => (
  <div id="sellers-active">
    <h2>Aprovados x Reprovados</h2>
    <XYChart theme={customTheme} height={parentHeight} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
      <CustomChartBackground />
      <AnimatedAxis orientation="bottom" />
      <AnimatedAxis numTicks={6} label="Total" orientation="right" />
      <AnimatedGrid columns={false} numTicks={4} />
      <AnimatedAreaStack>
        {
          (approveds.length > 0 || reproveds.length > 0) ? (
            [approveds, reproveds].map((d) => (
              <AreaSeries
                key={d[0].label}
                dataKey={d[0].label}
                data={d}
                {...accessors}
                fillOpacity={0.4}
              />
            ))
          ) : <div />
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

export default withParentSize(TreinamentsDashboard);
