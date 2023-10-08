/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

'use client'

import { FC, useState } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import DateRangePicker from '@/components/DateRangePicker'
import { usePersistData } from '@/hooks/usePersistData'
import Dropdown from '@/components/Dropdown'
import { Spinner } from '@/components/styles'
import { LineChartData } from './interfaces'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

type PropsI = {
  transactionsChart: LineChartData
  highestChartNumber: number
  isFilteringData: boolean
  dropdownOptions: string[]
  transFilteredType: string
  handleTransFilter: (e: string | string[]) => void
}

const CHART_LABEL_COLORS = '#e6e6e6'
const CHART_GRID_LINES_COLORS = 'rgba(255, 255, 255, 0.1)'

const LineChart: FC<PropsI> = ({
  transactionsChart,
  highestChartNumber,
  isFilteringData,
  dropdownOptions,
  transFilteredType,
  handleTransFilter
}) => {
  const [hasDateRangeError, setHasDateRangeError] = useState(false)
  const {
    transactionStartDate,
    transactionEndDate,
    setTransactionStartDate,
    setTransactionEndDate
  } = usePersistData()

  const datePickerOnChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setTransactionStartDate(start)
    setTransactionEndDate(end)
    if (!start || !end) {
      setHasDateRangeError(true)
    } else {
      setHasDateRangeError(false)
    }
  }

  // TODO: Change the callback of labels to display MM/dd/yy
  const config = {
    id: 'TransactionsChart',
    type: 'line',
    data: transactionsChart,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 0
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxHeight: 9,
            font: { size: 15 },
            color: CHART_LABEL_COLORS
          }
        },
        tooltip: {
          interaction: {
            intersect: false,
            mode: 'index'
          },
          titleColor: '#4a41bd',
          titleMarginBottom: 8,
          titleFont: { size: 16 },
          backgroundColor: 'rgba(236, 244, 249, 0.7)',
          padding: {
            x: 32,
            y: 24
          },
          bodyColor: '#02337c',
          bodySpacing: 5,
          bodyFont: { size: 15 },
          usePointStyle: true,
          pointStyle: 'circle',
          boxHeight: 10,
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.dataset.rawData.at(context.dataIndex)}`
            }
          }
        }
      },
      scales: {
        y: {
          padding: 20,
          min: 0,
          max: highestChartNumber * 1.1,
          ticks: {
            stepSize: 30,
            color: CHART_LABEL_COLORS,
            callback: (value: any) => Math.round(value).toLocaleString('es-ES')
          },
          grid: {
            drawTicks: false,
            drawOnChartArea: true,
            color: CHART_GRID_LINES_COLORS
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            beginAtZero: true,
            setpSize: 5,
            padding: 15,
            color: CHART_LABEL_COLORS,
            indexAxis: 'x',
            autoSkip: false,
            font: { size: 13 }
          },
          grid: {
            drawTicks: false,
            drawOnChartArea: true,
            color: CHART_GRID_LINES_COLORS
          }
        }
      }
    }
  }

  return (
    <div className="max-h-[375px]">
      <div className="flex items-center justify-between mx-8">
        <div className="flex flex-col">
          {hasDateRangeError ? (
            <p className="text-xs text-red-400">Provide a date range</p>
          ) : (
            <div className="h-[1rem]" />
          )}
          <DateRangePicker
            startDate={transactionStartDate}
            endDate={transactionEndDate}
            onChange={datePickerOnChange}
          />
        </div>
        <div>
          <div className="h-[1rem]" />
          <Dropdown
            dropdownOptions={dropdownOptions}
            onChange={handleTransFilter}
            value={transFilteredType}
          />
        </div>
      </div>
      <div className="h-[21.5rem]">
        {isFilteringData ? (
          <div className="flex items-center justify-center mt-32">
            <Spinner size="xl" classes="border-violet-400 w-14 h-14" />
          </div>
        ) : (
          <Line {...config} />
        )}
      </div>
    </div>
  )
}

export default LineChart
