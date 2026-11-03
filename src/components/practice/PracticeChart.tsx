import { useEffect, useRef } from 'react'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { init, use as registerECharts, type ECharts } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { getWeekDays, type PracticeDay } from '../../lib/progress'

registerECharts([BarChart, GridComponent, TooltipComponent, SVGRenderer])

export function PracticeChart({ days }: { days: Record<string, PracticeDay> }) {
  const element = useRef<HTMLDivElement>(null)
  const chart = useRef<ECharts | null>(null)
  const week = getWeekDays()
  const values = week.map((day) => days[day.key]?.minutes ?? 0)

  useEffect(() => {
    if (!element.current) return
    chart.current = init(element.current, undefined, { renderer: 'svg' })
    const observer = new ResizeObserver(() => chart.current?.resize())
    observer.observe(element.current)
    return () => { observer.disconnect(); chart.current?.dispose() }
  }, [])

  useEffect(() => {
    chart.current?.setOption({
      animationDuration: 500,
      grid: { left: 34, right: 12, top: 22, bottom: 28 },
      tooltip: { trigger: 'axis', backgroundColor: '#132336', borderWidth: 0, textStyle: { color: '#fff' }, formatter: (params: unknown) => {
        const items = params as { name: string; value: number }[]
        return `${items[0].name}<br/>练习 <b>${items[0].value}</b> 分钟`
      } },
      xAxis: { type: 'category', data: week.map((day) => day.label), axisLine: { lineStyle: { color: '#d7d8d2' } }, axisTick: { show: false }, axisLabel: { color: '#6d7780', fontSize: 11 } },
      yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#e9e7df', type: 'dashed' } }, axisLabel: { color: '#8a9095', fontSize: 11 } },
      series: [{ type: 'bar', data: values.map((value, index) => ({ value, itemStyle: { color: index === 6 ? '#ff8d70' : '#2ebda9', borderRadius: [6, 6, 2, 2] } })), barWidth: '52%' }],
    })
  }, [days]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="practice-chart" ref={element} role="img" aria-label={`近七天练习分钟柱状图，分别为${week.map((day, index) => `${day.label} ${values[index]}分钟`).join('，')}`} />
}
