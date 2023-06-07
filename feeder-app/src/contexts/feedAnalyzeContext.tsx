import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
	SetStateAction,
	Dispatch,
} from 'react'
import { FeederList, LogList } from '../share/types'
import { endOfMonth } from 'date-fns'
import axios from 'axios'

interface FeedAnalyzeContextType {
	feederData: FeederList[]
	setFeederData: Dispatch<SetStateAction<FeederList[]>>
	startDate: Date
	setStartDate: Dispatch<SetStateAction<Date>>
	feedLogData: LogList[]
	setFeedLogData: Dispatch<SetStateAction<LogList[]>>
	selectedFeederId: number | null
	setSelectedFeederId: Dispatch<SetStateAction<number | null>>
}

interface FeedAnalyzeProviderProps {
	children: ReactNode
}

// 선택한 날짜를 db에 요청할 형식으로 변경
export const formatDate = (date: Date): string => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const formattedDate = `${year}-${month}-${day}`
	return formattedDate
}

const FeedAnalyzeContext = createContext<Partial<FeedAnalyzeContextType>>({})

const FeedAnalyzeProvider = ({ children }: FeedAnalyzeProviderProps) => {
	const [feederData, setFeederData] = useState<FeederList[]>([])
	const [feedLogData, setFeedLogData] = useState<LogList[]>([])
	const [startDate, setStartDate] = useState<Date>(new Date())
	const [selectedFeederId, setSelectedFeederId] = useState<number | null>(null)

	useEffect(() => {
		fetchData()
	}, [startDate, selectedFeederId])

	// 데이터 요청 로직
	const fetchData = async (): Promise<void> => {
		try {
			let logData = {
				start_date: formatDate(startDate),
				end_date: formatDate(endOfMonth(startDate)),
				feeders: 0,
				sort: 'asc',
			}

			// feederid가 있을때만 feeders 요청
			if (selectedFeederId) {
				logData.feeders = selectedFeederId
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

	return (
		<FeedAnalyzeContext.Provider
			value={{
				feederData,
				setFeederData,
				startDate,
				setStartDate,
				feedLogData,
				setFeedLogData,
				selectedFeederId,
				setSelectedFeederId,
			}}
		>
			{children}
		</FeedAnalyzeContext.Provider>
	)
}

const useFeedAnalyzeContext = () => useContext(FeedAnalyzeContext)

export { FeedAnalyzeProvider, useFeedAnalyzeContext }
