import React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryZoomContainer,
  VictoryTooltip,
  VictoryCursorContainer,
  VictoryVoronoiContainer,
  VictoryArea, LineSegment, VictoryGroup, VictoryPortal, VictoryScatter, VictoryLabel,
} from 'victory';
import { withParentSize } from '@visx/responsive';
import { WithParentSizeProps, WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';

const provesSent = [
  { date: new Date(2021, 2, 9), activities: 231 },
  { date: new Date(2021, 2, 8), activities: 201 },
  { date: new Date(2021, 2, 7), activities: 189 },
  { date: new Date(2021, 2, 6), activities: 156 },
  { date: new Date(2021, 2, 5), activities: 148 },
  { date: new Date(2021, 2, 4), activities: 148 },
  { date: new Date(2021, 2, 3), activities: 147 },
  { date: new Date(2021, 2, 2), activities: 146 },
  { date: new Date(2021, 2, 1), activities: 144 },
  { date: new Date(2021, 1, 28), activities: 98 },
  { date: new Date(2021, 1, 27), activities: 96 },
  { date: new Date(2021, 1, 26), activities: 88 },
  { date: new Date(2021, 1, 25), activities: 74 },
  { date: new Date(2021, 1, 24), activities: 56 },
  { date: new Date(2021, 1, 23), activities: 15 },
];

const treinamentTests = [
  { date: new Date(2021, 2, 9), activities: 206 },
  { date: new Date(2021, 2, 8), activities: 203 },
  { date: new Date(2021, 2, 7), activities: 201 },
  { date: new Date(2021, 2, 6), activities: 196 },
  { date: new Date(2021, 2, 5), activities: 125 },
  { date: new Date(2021, 2, 4), activities: 108 },
  { date: new Date(2021, 2, 3), activities: 105 },
  { date: new Date(2021, 2, 2), activities: 96 },
  { date: new Date(2021, 2, 1), activities: 84 },
  { date: new Date(2021, 1, 28), activities: 78 },
  { date: new Date(2021, 1, 27), activities: 76 },
  { date: new Date(2021, 1, 26), activities: 68 },
  { date: new Date(2021, 1, 25), activities: 44 },
  { date: new Date(2021, 1, 24), activities: 36 },
  { date: new Date(2021, 1, 23), activities: 35 },
];

// @ts-ignore
const ActivitiesDashboard : React.FC<WithParentSizeProps & WithParentSizeProvidedProps> = ({
  parentWidth = 10,
  parentHeight = 10,
}) => (
  <VictoryChart
    domainPadding={0}
    animate={{ duration: 800, easing: 'bounce' }}
    theme={VictoryTheme.material}
    colorScale="green"
    width={parentWidth}
    containerComponent={(
      <VictoryVoronoiContainer
        title="Evolução Atividades"
        activateLabels
        activateData
        responsive
      />
    )}
  >
    <VictoryStack colorScale="blue">
      <VictoryGroup
        data={treinamentTests.sort((a, b) => a.date.getTime() - b.date.getTime()).map((a) => ({ ...a, date: a.date.toLocaleDateString(), label: `${a.date.toLocaleDateString()} - ${a.activities} treinamentos concluídos` }))}
        style={{
          labels: { fill: 'white' },
        }}
        labelComponent={(
          <VictoryTooltip
            flyoutStyle={{
              stroke: ({ datum }) => 'white',
              fill: '#222',
            }}
          />
        )}
      >
        <VictoryArea
          x="date"
          y="activities"
          interpolation="natural"
          style={{
            data: {
              fillOpacity: 0.8, stroke: '#889896', strokeWidth: 2,
            },
          }}
        />
        <VictoryScatter
          style={{ data: { fill: '#999' } }}
          bubbleProperty="activities"
          maxBubbleSize={5}
          minBubbleSize={2}
          x="date"
          y="activities"
        />
      </VictoryGroup>
      <VictoryGroup
        data={provesSent.sort((a, b) => a.date.getTime() - b.date.getTime()).map((a) => ({ ...a, date: a.date.toLocaleDateString(), label: `${a.date.toLocaleDateString()} - ${a.activities} provas enviadas` }))}
        labelComponent={(
          <VictoryTooltip
            flyoutStyle={{
              stroke: ({ datum }) => 'white',
              fill: '#222',
            }}
          />
        )}
        style={{
          labels: { fill: 'white' },
        }}
      >
        <VictoryArea
          x="date"
          y="activities"
          interpolation="natural"
          style={{
            data: {
              fillOpacity: 0.8, stroke: '#889896', strokeWidth: 2,
            },
          }}
        />
        <VictoryScatter
          style={{ data: { fill: '#999' } }}
          bubbleProperty="activities"
          maxBubbleSize={5}
          minBubbleSize={2}
          x="date"
          y="activities"
        />
      </VictoryGroup>
    </VictoryStack>
    <VictoryAxis
      tickValues={treinamentTests.sort((a, b) => a.date.getTime() - b.date.getTime()).map((a) => a.date.toLocaleDateString())}
      style={
        {
          axis: { stroke: 'white', padding: 15 },
          axisLabel: { padding: 30, fill: 'white' },
          ticks: { size: 8 },
          grid: { stroke: '#889896', strokeWidth: 1 },
          tickLabels: {
            fontSize: 11, padding: 5, fill: 'white', angle: 30,
          },
        }
      }
    />
    <VictoryAxis
      dependentAxis
      crossAxis
      style={
        {
          axis: { stroke: 'white', padding: 15 },
          axisLabel: { padding: 30, fill: 'white' },
          ticks: { size: 8 },
          grid: { stroke: '#889896', strokeWidth: 1 },
          tickLabels: {
            fontSize: 11, padding: 5, fill: 'white', angle: 30,
          },
        }
      }
      label="Qtd. Atividades"
      offsetX={50}
      standalone={false}
    />
  </VictoryChart>
);

export default withParentSize(ActivitiesDashboard);
