import '../styles/style.css'
import React, { useState } from 'react'
import DropdownMenu from './dropdownMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

function NavBar() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const navigate = useNavigate()
	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}
	const handleClickLogo = () => {
		navigate('/')
	}
	return (
		<div className='sideBar'>
			<div className='logo'>
				<img src='logo.png' alt='로고 이미지' onClick={handleClickLogo} />
			</div>
			<nav>
				<div>
					<div
						className='navBarName'
						onClick={toggleDropdown}
						style={{
							backgroundColor: isOpen ? '#ffdada' : '',
							color: isOpen ? '#ff5e5e' : '',
						}}
					>
						급이{' '}
						<span style={{ float: 'right', paddingRight: '15px' }}>
							{isOpen ? (
								<FontAwesomeIcon icon={faCaretUp} />
							) : (
								<FontAwesomeIcon icon={faCaretDown} />
							)}
						</span>
					</div>
					{isOpen && <DropdownMenu />}
				</div>
			</nav>
		</div>
	)
}

export default NavBar
