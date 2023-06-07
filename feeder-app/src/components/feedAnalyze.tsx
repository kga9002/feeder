import { FeederList, LogList } from '../share/types'
import '../styles/feedAnalyze.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { Line } from 'react-chartjs-2'
import { useFeedAnalyzeContext } from '../contexts/feedAnalyzeContext'
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

function FeedAnalyze() {
	const {
		feederData,
		startDate,
		setStartDate,
		feedLogData,
		setSelectedFeederId,
	} = useFeedAnalyzeContext()

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

	// 날짜에서 일만 추출해서 라벨로 등록
	const labels = feedLogData?.map((item: LogList) => {
		const date = new Date(item.created_datetime)
		return date.getDate()
	})

	// 차트 옵션 설정
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: '급이 현황',
			},
		},
	}

	// amount를 data로 설정
	const data = {
		labels,
		datasets: [
			{
				label: '급이량',
				data: feedLogData?.map((item: LogList) => item.amount),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
		],
	}

	return (
		<div className='container'>
			<header className='headerContainer'>
				<div>
					급이 {'>'} <span style={{ color: 'red' }}>급이 내역 분석</span>
				</div>
			</header>
			<div className='bodyContainer'>
				<div>
					<span>일일 급이량 그래프</span>
					<div className='dateContainer'>
						<DatePicker
							selected={startDate}
							onChange={(date: Date) => {
								setStartDate?.(date)
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
						{feederData?.map((feeder: FeederList) => (
							<div className='feederContainer' key={feeder.id}>
								<input
									type='checkbox'
									key={feeder.id}
									id={feeder.name}
									name='feeder'
									onChange={(e) => {
										const isChecked = e.target.checked
										const feederId = isChecked ? feeder.id : null
										setSelectedFeederId?.(feederId)
										checkOnly(e.target)
									}}
								/>
								<label htmlFor={feeder.name}>{feeder.name}</label>
								<br />
							</div>
						))}
					</div>
					<div className='feederGraph'>
						{feedLogData?.length === 0 ? (
							<div>
								급이기를 선택해서 원하는 달에
								<br />
								얼마나 급이됐는지 그래프로 확인해보세요.
							</div>
						) : (
							<div className='graphDiv'>
								<Line
									style={{ display: 'inline' }}
									options={options}
									data={data}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default FeedAnalyze
