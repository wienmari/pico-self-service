'use client'
import GaugeComponent from 'react-gauge-component';

interface ThermometerProps { value: number }

export default function Hydromometer({ value }: ThermometerProps) {
  return (
    <GaugeComponent
        value={value}
        minValue={0}
        maxValue={100}
        type="radial"
        arc={{
            gradient: true,
            width: 0.15,
            padding: 0,
            subArcs: [
                {
                    limit: 20,
                    color: '#1034A6',
                    showTick: true
                },
                {
                    limit: 40,
                    color: '#412F88',
                    showTick: true
                },
                {
                    limit: 60,
                    color: '#722B6A',
                    showTick: true
                },
                {
                    limit: 80,
                    color: '#A2264B',
                    showTick: true
                },
                {
                    limit: 100,
                    color: '#D3212D',
                    showTick: true
                },
                { color: '#F62D2D' }
            ]
        }}
        labels={{
            valueLabel: {
                formatTextValue: value => value + '%',
                style: {fontSize: 40}
            },
            tickLabels: {
                type: 'outer',
                defaultTickValueConfig: {
                    formatTextValue: (value: number) => value + '%',
                    style: {fontSize: 15}
                }
            }
        }}
        pointer={{
            animationDelay: 0
        }}
    />
  );
}
