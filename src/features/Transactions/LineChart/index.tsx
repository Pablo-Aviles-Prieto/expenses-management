/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC } from 'react'
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
import { useTransactionsChartData } from './hooks/useTransactionsChartData'

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
  transactions: TransactionObjBack[]
}

const CHART_LABEL_COLORS = '#e6e6e6'
const CHART_GRID_LINES_COLORS = 'rgba(255, 255, 255, 0.1)'

const LineChart: FC<PropsI> = ({ transactions }) => {
  const {
    transactionStartDate,
    transactionEndDate,
    setTransactionStartDate,
    setTransactionEndDate
  } = usePersistData()
  const { transactionsChartData, highestAmount } = useTransactionsChartData({ transactions })

  const datePickerOnChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setTransactionStartDate(start)
    setTransactionEndDate(end)
  }

  const config = {
    id: 'TransactionsChart',
    type: 'line',
    data: transactionsChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 2
        }
      },
      plugins: {
        legend: {
          labels: {
            color: CHART_LABEL_COLORS
          }
        },
        tooltip: {
          interaction: {
            intersect: false,
            mode: 'index'
          },
          titleColor: '#006BB3',
          titleMarginBottom: 8,
          titleFont: { size: 15 },
          backgroundColor: 'rgba(236, 244, 249, 0.7)',
          padding: {
            x: 32,
            y: 24
          },
          bodyColor: '#006BB3',
          bodySpacing: 5,
          bodyFont: { size: 13 },
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
          max: highestAmount * 1.1,
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
            maxRotation: 60,
            minRotation: 60,
            beginAtZero: true,
            setpSize: 5,
            padding: 15,
            color: CHART_LABEL_COLORS,
            indexAxis: 'x',
            autoSkip: false
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
    <div className="max-h-[350px]">
      <div className="mb-4">
        <DateRangePicker
          startDate={transactionStartDate}
          endDate={transactionEndDate}
          onChange={datePickerOnChange}
        />
      </div>
      <Line {...config} />
    </div>
  )
}

export default LineChart
