import React, { useState, useEffect } from 'react'
import { FeederList, LogList } from '../share/types'
import '../styles/feedAnalyze.css'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { endOfMonth } from 'date-fns'
import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
		},
		title: {
			display: true,
			text: 'Chart.js Line Chart',
		},
	},
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
	labels,
	datasets: [
		{
			label: 'Dataset 1',
			data: 20,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		},
		{
			label: 'Dataset 2',
			data: 30,
			borderColor: 'rgb(53, 162, 235)',
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
		},
	],
}

function FeedAnalyze() {
	const [feederData, setFeederData] = useState<FeederList[]>([])
	const [startDate, setStartDate] = useState<Date>(new Date())
	const [feedLogData, setFeedLogData] = useState<LogList[]>([])
	const [selectedFeederId, setSelectedFeederId] = useState<number | null>(null)

	// 체크박스 하나만 선택되게 하는 로직
	const checkOnly = (target: HTMLInputElement) => {
		const checkboxes = document.getElementsByName(
			'feeder'
		) as unknown as HTMLInputElement[]
		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i] !== target) {
				checkboxes[i].checked = false
			}
		}
	}

	// 날짜 선택 받았을때 쿼리에 넣을 형태로 변경하는 로직
	const formatDate = (startDate: Date) => {
		const year = startDate.getFullYear()
		const month = String(startDate.getMonth() + 1).padStart(2, '0')
		const day = String(startDate.getDate()).padStart(2, '0')

		const formattedDate = `${year}-${month}-${day}`
		return formattedDate
	}

	// 데이터 가져오는 로직
	const fetchData = async () => {
		try {
			let logData = {
				start_date: formatDate(startDate),
				end_date: formatDate(endOfMonth(startDate)),
				feeders: 0,
				sort: 'asc',
			}

			if (selectedFeederId) {
				logData.feeders = selectedFeederId // Assign selectedFeederId to feeders property
			}

			const logResponse = await axios.get(
				'http://intflowserver2.iptime.org:44480/feeder_log/list',
				{
					params: logData,
				}
			)
			setFeedLogData(logResponse.data)

			const feederResponse = await axios.get(
				'http://intflowserver2.iptime.org:44480/feeder/list'
			)
			setFeederData(feederResponse.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [startDate, selectedFeederId])

	// 데이터 확인용
	useEffect(() => {
		console.log(feedLogData)
	}, [feedLogData])

	return (
		<div className='container'>
			<header className='headerContainer'>
				<div>
					급여 {'>'} <span style={{ color: 'red' }}>급여 내역 분석</span>
				</div>
			</header>
			<div className='bodyContainer'>
				<div>
					<span>일일 급이량 그래프</span>
					<div className='dateContainer'>
						<DatePicker
							selected={startDate}
							onChange={(date: Date) => {
								setStartDate(date)
							}}
							dateFormat='yyyy/MM'
							locale={ko}
							showMonthYearPicker
							maxDate={new Date()}
						/>
					</div>
				</div>
				<div className='graphContainer'>
					<div className='feederList'>
						{feederData.map((feeder: FeederList) => (
							<div className='feederContainer' key={feeder.id}>
								<input
									type='checkbox'
									key={feeder.id}
									id={feeder.name}
									name='feeder'
									onChange={(e) => {
										const isChecked = e.target.checked
										const feederId = isChecked ? feeder.id : null
										setSelectedFeederId(feederId)
										checkOnly(e.target)
									}}
								/>
								<label htmlFor={feeder.name}>{feeder.name}</label>
								<br />
							</div>
						))}
					</div>
					<div className='feederGraph'>
						{feedLogData.length === 0 ? (
							<div>
								급이기를 선택해서 원하는 달에
								<br />
								얼마나 급이됐는지 그래프로 확인해보세요.
							</div>
						) : (
							<div>
								<Line options={options} data={data} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default FeedAnalyze
