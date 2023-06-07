import React, { useCallback, useState } from 'react'
import '../styles/inputModal.css'
import { FeederList } from '../share/types'
import {
	formatDate,
	useFeedAnalyzeContext,
} from '../contexts/feedAnalyzeContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import axios from 'axios'

function InputModal({ setIsModalOpen, setStatus }: any) {
	const { feederData } = useFeedAnalyzeContext()
	const [amountNumber, setAmountNumber] = useState<number>(0)
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedFeeder, setSelectedFeeder] = useState<string>('null')

	// 모달 닫기
	const closeModal = () => {
		setIsModalOpen(false)
	}

	// input number 10단위로 올리고 숫자 체크
	const handleIncrement = () => {
		setAmountNumber(amountNumber + 10)
		if (amountNumber + 10 > 999) {
			alert('999보다 큰 수는 입력할 수 없습니다.')
			setAmountNumber(999)
		}
	}

	// input number 10단위로 내리고 숫자체크
	const handleDecrement = () => {
		setAmountNumber(amountNumber - 10)
		if (amountNumber - 10 < 0) {
			alert('0보다 작은 수는 입력할 수 없습니다.')
			setAmountNumber(1)
		}
	}

	// input number 키보드 입력시 숫자 체크
	const checkNumber = (num: number, e: React.ChangeEvent<HTMLInputElement>) => {
		if (num < 0) {
			alert('0보다 작은 수는 입력할 수 없습니다.')
			setAmountNumber(1)
			e.target.value = '1'
		} else if (num > 999) {
			alert('999보다 큰 수는 입력할 수 없습니다.')
			setAmountNumber(999)
			e.target.value = '999'
		}
	}

	// input number value 설정해도 수기입력 가능하게 조치
	const changeNumber = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		checkNumber(parseInt(e.target.value), e)
		setAmountNumber(parseInt(e.target.value))
	}, [])

	// 선택한 급이기 아이디 세팅
	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedFeeder(e.target.value)
	}

	// 데이터 post 보내기
	const submitData = async () => {
		const headers = {
			'Content-Type': 'application/json',
		}
		try {
			const res = await axios.post(
				'http://intflowserver2.iptime.org:44480/feeder_log',
				{
					feeder_id: parseInt(selectedFeeder),
					amount: amountNumber,
					created_date: formatDate(selectedDate),
				},
				{
					headers: headers,
				}
			)

			closeModal()

			if (res.status === 200) {
				setStatus(200)
			} else {
				setStatus('error')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='Modalcontainer'>
			<span>수기입력</span>
			<button className='close' onClick={closeModal}>
				X
			</button>
			<hr />
			<label>
				급이기 <span style={{ color: 'red' }}>*</span>
			</label>
			<br />
			<select onChange={handleSelectChange}>
				<option value='null'>급이기</option>
				{feederData?.map((feeder: FeederList) => (
					<option key={feeder.id} value={feeder.id}>
						{feeder.name}
					</option>
				))}
			</select>
			<br />
			<label>
				급이량(kg)<span style={{ color: 'red' }}>*</span>
			</label>
			<br />
			<input
				type='number'
				value={amountNumber}
				onChange={changeNumber}
				min={1}
				max={999}
			/>
			<button type='button' onClick={handleIncrement}>
				+10
			</button>
			<button type='button' onClick={handleDecrement}>
				-10
			</button>
			<br />
			<label>
				급이일자<span style={{ color: 'red' }}>*</span>
			</label>
			<br />
			<DatePicker
				selected={selectedDate}
				onChange={(date: Date) => {
					setSelectedDate(date)
				}}
				dateFormat='yyyy/MM/dd'
				locale={ko}
				maxDate={new Date()}
			/>
			<hr />
			<button
				onClick={submitData}
				disabled={selectedFeeder === 'null' || amountNumber === 0}
			>
				저장
			</button>
		</div>
	)
}

export default InputModal
