import '../styles/feedManage.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import { useFeedAnalyzeContext } from '../contexts/feedAnalyzeContext'
import { components } from 'react-select'
import ko from 'date-fns/locale/ko'
import { LogList } from '../share/types'
import { useFeedManageContext } from '../contexts/feedManageContext'
import InputModal from './inputModal'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// react select 체크박스 옵션
const Option = (props: any) => {
	return (
		<div>
			<components.Option {...props}>
				<input
					type='checkbox'
					checked={props.isSelected}
					onChange={() => null}
				/>{' '}
				<label>{props.label}</label>
			</components.Option>
		</div>
	)
}

function FeedManage() {
	const { feederData } = useFeedAnalyzeContext()
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [status, setStatus] = useState<number | string>('')

	const {
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		feedLogData,
		sortByAmount,
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
	} = useFeedManageContext()

	// 급이기 데이터 가져와서 설정
	const options = feederData?.map((data) => ({
		value: data.id,
		label: data.name,
	}))

	useEffect(() => {
		if (status === 200) {
			toast('저장이 완료 되었습니다.')
		} else if (status === 'error') {
			toast('저장에 실패하였습니다.')
		}
		setStatus('')
	}, [status])

	return (
		<div>
			<header className='headerContainer'>
				<div>
					급이 {'>'} <span style={{ color: 'red' }}>급이 내역 관리</span>
				</div>
			</header>
			<div className='mainContainer'>
				<div className='titleContainer'>
					<div className='title'>
						<span>급이내역</span>
						<button className='inputBtn' onClick={() => setIsModalOpen(true)}>
							수기입력
						</button>
					</div>
				</div>
				<div className='searchContainer'>
					<div className='labelBox'>
						<label htmlFor='months'>기간선택</label>
						<label htmlFor='feeder' style={{ float: 'right' }}>
							급이기선택
						</label>
					</div>
					<div>
						<select ref={selectRef} name='months' onChange={handleSelectChange}>
							<option value='0'>전체</option>
							<option value='1'>1개월</option>
							<option value='3'>3개월</option>
							<option value='6'>6개월</option>
							<option value='null'>직접입력</option>
						</select>
					</div>
					<div>
						<DatePicker
							placeholderText='YYYY.MM.DD'
							className='datePicker'
							selected={startDate}
							onChange={(date) => {
								setStartDate?.(date)
								handleDatePickerChange?.()
							}}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							maxDate={new Date()}
							dateFormat='yyyy/MM/dd'
							locale={ko}
						></DatePicker>
						~
						<DatePicker
							placeholderText='YYYY.MM.DD'
							className='datePicker'
							selected={endDate}
							onChange={(date) => {
								setEndDate?.(date)
								handleDatePickerChange?.()
							}}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							minDate={startDate}
							maxDate={new Date()}
							dateFormat='yyyy/MM/dd'
							locale={ko}
						></DatePicker>
					</div>
					<div>
						<Select
							ref={feederSelectRef}
							options={options}
							isMulti
							onChange={handleChange}
							className='selectFeeder'
							closeMenuOnSelect={false}
							hideSelectedOptions={false}
							components={{
								Option,
							}}
						/>
					</div>
					<button className='resetBtn' onClick={handleReset}>
						초기화
					</button>
				</div>

				<div className='tableContainer'>
					<div>총 {feedLogData?.length} 건</div>
					{feedLogData?.length === 0 ? (
						<div>발생된 급이 내역이 없습니다.</div>
					) : (
						<table>
							<thead>
								<tr>
									<td style={{ width: '12%' }}>돈사</td>
									<td style={{ width: '12%' }}>돈방</td>
									<td style={{ width: '25%' }}>급이기 이름</td>
									<td style={{ width: '25%' }}>
										<label htmlFor='feedAmount'>급이량(kg)</label>&nbsp;
										<select name='feedAmount' onChange={handleAmountChange}>
											<option value='null'>날짜순</option>
											<option value='asc'>오름차순</option>
											<option value='desc'>내림차순</option>
										</select>
									</td>
									<td style={{ width: '25%' }}>
										<label htmlFor='feedDate'>급이일자</label>
										<select name='feedDate' onChange={handleDateChange}>
											<option value='desc'>최신순</option>
											<option value='asc'>오래된순</option>
										</select>
									</td>
								</tr>
							</thead>

							<tbody>
								{feedLogData &&
									feedLogData
										.sort((a: LogList, b: LogList) => {
											if (sortByAmount === 'asc') {
												return sortByAmountAscending?.(a, b) || 0
											} else if (sortByAmount === 'desc') {
												return sortByAmountDescending?.(a, b) || 0
											} else {
												return 0 // No sorting
											}
										})
										.map((item: LogList) => (
											<tr key={item.id}>
												<td>{item.feeder_info.pen_info.piggery_info.name}</td>
												<td>{item.feeder_info.pen_info.name}</td>
												<td>{item.feeder_info.name}</td>
												<td>{item.amount}</td>
												<td>
													{new Date(item.created_datetime).toLocaleDateString()}
												</td>
											</tr>
										))}
							</tbody>
						</table>
					)}
				</div>
			</div>
			<div>
				{isModalOpen && (
					<InputModal setIsModalOpen={setIsModalOpen} setStatus={setStatus} />
				)}
			</div>
			<ToastContainer
				position='top-center'
				limit={1}
				closeButton={false}
				autoClose={600}
				hideProgressBar
			/>
		</div>
	)
}

export default FeedManage
