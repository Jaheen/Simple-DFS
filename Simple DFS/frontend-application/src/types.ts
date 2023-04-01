export interface ServerData {
    serverName: string
    serverAddress: string
    portNumber: number
    accessToken: string
}
export interface ServerInfo {
    serverID: number
    serverName: string
    serverAddress: string
    portNumber: number
    storage?: {
        freeSpace: number
        usedSpace: number
    }
}

export interface AppContext {
    servers: Array<ServerInfo>
    addNewServer: (server: ServerData) => void,
    updateExistingServer: (server: ServerData, serverID: number) => void
}
