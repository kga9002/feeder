import {
	ReactNode,
	createContext,
	useEffect,
	useRef,
	useState,
	useContext,
} from 'react'
import { LogList } from '../share/types'
import qs from 'qs'
import { formatDate } from './feedAnalyzeContext'
import { MultiValue } from 'react-select'
import axios from 'axios'
import { toast } from 'react-toastify'

interface FeedManageContextType {
	startDate: Date | null
	setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
	endDate: Date | null
	setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
	selectedOptions: number[]
	setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>
	sortData: string
	setSortData: React.Dispatch<React.SetStateAction<string>>
	feedLogData: LogList[]
	setFeedLogData: React.Dispatch<React.SetStateAction<LogList[]>>
	sortByAmount: string | null
	setSortByAmount: React.Dispatch<React.SetStateAction<string | null>>
	selectRef: React.RefObject<HTMLSelectElement>
	feederSelectRef: React.RefObject<any>
	handleDatePickerChange: () => void
	handleChange: (newValue: MultiValue<OptionType>) => void
	handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	handleReset: () => void
	sortByAmountAscending: (a: LogList, b: LogList) => number
	sortByAmountDescending: (a: LogList, b: LogList) => number
	handleAmountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	handleDateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

interface OptionType {
	value: number
	label: string
}

const FeedManageContext = createContext<Partial<FeedManageContextType>>({})

interface FeedManageProviderProps {
	children: ReactNode
}

const FeedManageProvider = ({ children }: FeedManageProviderProps) => {
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)
	//feeder 선택 한 id 배열
	const [selectedOptions, setSelectedOptions] = useState<number[]>([])
	const [sortData, setSortData] = useState<string>('desc')
	const [feedLogData, setFeedLogData] = useState<LogList[]>([])
	const [sortByAmount, setSortByAmount] = useState<string | null>(null)

	const selectRef = useRef<HTMLSelectElement>(null)
	const feederSelectRef = useRef<any>(null)

	// 해당 데이터 변할때마다 새로 불러오기
	useEffect(() => {
		fetchData()
	}, [startDate, endDate, selectedOptions, sortData])

	// 데이터 요청
	const fetchData = async (): Promise<void> => {
		try {
			let logData = {
				start_date: startDate ? formatDate(startDate as Date) : null,
				end_date: endDate ? formatDate(endDate as Date) : null,
				feeders: null as number[] | null,
				sort: sortData,
			}

			if (selectedOptions) {
				logData.feeders = selectedOptions
			}

			const logResponse = await axios.get(
				'http://intflowserver2.iptime.org:44480/feeder_log/list',
				{
					params: logData,
					paramsSerializer: function (params: any) {
						return qs.stringify(params, {
							arrayFormat: 'repeat',
							skipNulls: true,
						})
					},
				}
			)
			setFeedLogData?.(logResponse.data)
		} catch (error) {
			console.log(error)
		}
	}

	// 데이트피커 클릭시 직접입력으로 변경
	const handleDatePickerChange = () => {
		if (selectRef.current) {
			selectRef.current.value = 'null'
		}
	}

	// react select에서 선택시에 선택한 급이기 번호 state 설정
	const handleChange = (newValue: MultiValue<OptionType>) => {
		setSelectedOptions(newValue.map((option: { value: any }) => option.value))
	}

	// 사용자가 개월수 선택했을때 날짜 value 설정
	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = parseInt(e.target.value)
		const currentDate = new Date()

		let startDateValue
		let endDateValue

		switch (selectedValue) {
			case 1:
				startDateValue = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() - 1,
					currentDate.getDate()
				)
				endDateValue = currentDate
				break
			case 3:
				startDateValue = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() - 3,
					currentDate.getDate()
				)
				endDateValue = currentDate
				break
			case 6:
				startDateValue = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() - 6,
					currentDate.getDate()
				)
				endDateValue = currentDate
				break
			default:
				startDateValue = null
				endDateValue = null
		}

		setStartDate(startDateValue)
		setEndDate(endDateValue)
	}

	// 초기화 버튼 기능
	const handleReset = () => {
		setStartDate(null)
		setEndDate(null)
		if (selectRef.current) {
			selectRef.current.value = '0'
		}
		feederSelectRef.current?.clearValue()
	}

	// 급이량 정렬할 함수
	const sortByAmountAscending = (a: LogList, b: LogList) => {
		return a.amount - b.amount
	}

	const sortByAmountDescending = (a: LogList, b: LogList) => {
		return b.amount - a.amount
	}

	// 급이량 정렬 선택했을때 세팅
	const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortByAmount(e.target.value)
	}

	// 날짜 정렬 선택했을때 세팅
	const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortData(e.target.value)
	}

	return (
		<FeedManageContext.Provider
			value={{
				startDate,
				setStartDate,
				endDate,
				setEndDate,
				selectedOptions,
				setSelectedOptions,
				sortData,
				setSortData,
				feedLogData,
				setFeedLogData,
				sortByAmount,
				setSortByAmount,
				selectRef,
				feederSelectRef,
				handleDatePickerChange,
				handleChange,
				handleSelectChange,
				handleReset,
				sortByAmountAscending,
				sortByAmountDescending,
				handleAmountChange,
				handleDateChange,
			}}
		>
			{children}
		</FeedManageContext.Provider>
	)
}

const useFeedManageContext = () => useContext(FeedManageContext)

export { FeedManageProvider, useFeedManageContext }
