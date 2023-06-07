export interface FeederList {
	id: number
	name: string
	pen_info: PenInfo
}

interface PenInfo {
	id: number
	name: string
	piggery_info: PiggeryInfo
}

interface PiggeryInfo {
	id: number
	name: string
}

export interface LogList {
	id: number
	feeder_info: FeederList
	amount: number
	created_datetime: Date
}

export {}
