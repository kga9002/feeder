import React from 'react'
import '../styles/dropdownMenu.css'
import { NavLink } from 'react-router-dom'

const DropdownMenu = () => {
	return (
		<div>
			<div className='list-cover'>
				<NavLink to='./feedAnalyze' className='list'>
					급이 내역 분석
				</NavLink>
			</div>
			<div className='list-cover'>
				<NavLink to='./feedManage' className='list'>
					급이 내역 관리
				</NavLink>
			</div>
		</div>
	)
}

export default DropdownMenu
