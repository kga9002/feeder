export interface FeederList {
	id: number
	name: string
	penInfo: PenInfo
}

interface PenInfo {
	id: number
	name: string
	piggeryInfo: PiggeryInfo
}

interface PiggeryInfo {
	id: number
	name: string
}

export interface LogList {
	id: number
	feederInfo: FeederList
	amount: number
	created_datetime: Date
}

export {}
