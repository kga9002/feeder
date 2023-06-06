import '../styles/style.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import FeedAnalyze from './feedAnalyze'
import FeedManage from './feedManage'

function contents() {
	return (
		<div className='contents'>
			<Routes>
				<Route
					path='/'
					element={<Navigate to='./feedAnalyze'></Navigate>}
				></Route>
				<Route path='/feedAnalyze' element={<FeedAnalyze />} />
				<Route path='/feedManage' element={<FeedManage />} />
			</Routes>
		</div>
	)
}

export default contents
