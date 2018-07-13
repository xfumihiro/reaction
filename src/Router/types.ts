import { RouteConfig } from "found"
import { ComponentType } from "react"
import { Environment } from "relay-runtime"
import { Breakpoint } from "Utils/Responsive"

type ReactComponent = ComponentType<any>
type HistoryProtocol = "browser" | "hash" | "memory"

export interface AppConfig {
  historyProtocol?: HistoryProtocol
  initialBreakpoint?: Breakpoint
  initialRoute?: string
  routes: RouteConfig
  url?: string
  user?: User
}

export interface ClientResolveProps {
  ClientApp: ReactComponent
}

export interface ServerResolveProps {
  ServerApp?: ReactComponent
  redirect?: string
  status?: string
}

export interface AppShellProps {
  loadableState?: {
    getScriptTag: () => string
  }
  data?: Array<object>
}

export interface Router {
  currentUser: User
  relayEnvironment: Environment
  routes: RouteConfig
  resolver: any // FIXME
}

export interface AppStateContainer {
  system?: Router
}

export interface BootProps extends AppStateContainer {
  initialBreakpoint?: Breakpoint
  [x: string]: any // User can pass in any properties on boot
}

export interface PreloadLinkContainer {
  isLoading: boolean
}
