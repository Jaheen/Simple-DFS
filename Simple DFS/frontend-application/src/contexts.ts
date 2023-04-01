import { createContext } from 'react'
import { AppContext as AppContextType, ServerData } from './types'

export const AppContext = createContext<AppContextType>({
    servers: [],
    addNewServer: (server: ServerData) => { },
    updateExistingServer: (server: ServerData, serverID: number) => { }
})