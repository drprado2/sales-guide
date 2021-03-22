import React, { useState } from 'react';
import { WithParentSizeProps, WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup, VictoryLabel,
  VictoryLegend,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { withParentSize } from '@visx/responsive';
import { Card } from 'primereact/card';
import './styles.scss';

const provesSetByProduct = [
  { product: 'Quantum 360 6', amount: 326 },
  { product: 'Kayano 27', amount: 489 },
  { product: 'Novablast', amount: 413 },
  { product: 'Kinsei OG', amount: 126 },
  { product: 'Tiger Fabre', amount: 98 },
  { product: 'GT-1000', amount: 47 },
  { product: 'GT-2000', amount: 116 },
  { product: 'GEL-Nimbus 23', amount: 529 },
  { product: 'Dynablast', amount: 336 },
];

const treinamentDoneByProduct = [
  { product: 'Quantum 360 6', amount: 126 },
  { product: 'Kayano 27', amount: 189 },
  { product: 'Novablast', amount: 113 },
  { product: 'Kinsei OG', amount: 126 },
  { product: 'Tiger Fabre', amount: 118 },
  { product: 'GT-1000', amount: 147 },
  { product: 'GT-2000', amount: 116 },
  { product: 'GEL-Nimbus 23', amount: 229 },
  { product: 'Dynablast', amount: 136 },
];

const ProductsStackBarDashboard : React.FC<WithParentSizeProps & WithParentSizeProvidedProps> = ({
  parentWidth = 10,
  parentHeight = 10,
}) => (
  <Card className="products-stack-bar-dashboard">
    <h2>Atividades por Produto</h2>
    <VictoryChart
      animate={{ duration: 800, easing: 'bounce' }}
      theme={VictoryTheme.material}
      width={parentWidth}
      style={{ parent: { paddingTop: '20px', paddingLeft: '20px' } }}
    >
      <VictoryStack
        colorScale="cool"
      >
        <VictoryBar
          barRatio={0.5}
          x="product"
          y="amount"
          labelComponent={(
            <VictoryTooltip
              dy={20}
              flyoutStyle={{
                stroke: ({ datum }) => 'white',
                fill: '#222',
              }}
            />
          )}
          style={{
            labels: { fill: 'white' },
          }}
          data={treinamentDoneByProduct.map((x) => ({ ...x, label: `${x.product} - ${x.amount} treinamentos concluídos` }))}
        />
        <VictoryBar
          barRatio={0.5}
          x="product"
          y="amount"
          labelComponent={(
            <VictoryTooltip
              dy={20}
              flyoutStyle={{
                stroke: ({ datum }) => 'white',
                fill: '#222',
              }}
            />
          )}
          style={{
            labels: { fill: 'white' },
          }}
          data={provesSetByProduct.map((x) => ({ ...x, label: `${x.product} - ${x.amount} comprovações enviadas` }))}
          cornerRadius={{ top: 10 }}
        />
      </VictoryStack>
      <VictoryAxis
        style={
          {
            axis: { stroke: '#888', padding: 15 },
            axisLabel: { padding: 30, fill: '#888' },
            ticks: { size: 8 },
            grid: { stroke: '#889896', strokeWidth: 0 },
            tickLabels: {
              fontSize: 11, padding: 5, fill: '#888', angle: 30,
            },
          }
        }
      />
      <VictoryAxis
        dependentAxis
        crossAxis
        style={
          {
            axis: { stroke: '#888', padding: 15 },
            axisLabel: { padding: 35, fill: '#888' },
            ticks: { size: 8 },
            grid: { stroke: '#888', strokeWidth: 1 },
            tickLabels: {
              fontSize: 11, padding: 5, fill: '#888', angle: 30,
            },
          }
        }
        offsetX={38}
        standalone={false}
      />
    </VictoryChart>
  </Card>

);

export default withParentSize(ProductsStackBarDashboard);
