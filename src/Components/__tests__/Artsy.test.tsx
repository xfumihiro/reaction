import React from "react"
import renderer from "react-test-renderer"

import "jest-styled-components"

jest.mock("../../Relay/createEnvironment", () => ({
  createEnvironment: (config: { user: User }) => ({
    description: `A mocked env for ${
      config.user ? config.user.id : "no-current-user"
    }`,
  }),
}))

import * as Artsy from "../Artsy"

const ShowCurrentUser: React.SFC<
  Artsy.ContextProps & { additionalProp?: string }
> = props => {
  let text = props.currentUser ? props.currentUser.id : "no-current-user"
  if (props.additionalProp) {
    text = `${text} & ${props.additionalProp}`
  }
  return <div>{text}</div>
}
// This HOC adds the context to the component.
const WithCurrentUser = Artsy.ContextConsumer(ShowCurrentUser)

const ShowRelayEnvironment: React.SFC<Artsy.ContextProps> = props => {
  const mockedEnv: any = props.relayEnvironment
  return <div>{mockedEnv.description}</div>
}
const WithRelayEnvironment = Artsy.ContextConsumer(ShowRelayEnvironment)

describe("Artsy context", () => {
  const currentUser: User = {
    id: "andy-warhol",
    accessToken: "secret",
  }

  describe("concerning the current user", () => {
    let originalEnv = null

    beforeAll(() => {
      originalEnv = process.env
      process.env = Object.assign({}, originalEnv, {
        USER_ID: "user-id-from-env",
        USER_ACCESS_TOKEN: "user-access-token-from-env",
      })
    })

    afterAll(() => {
      process.env = originalEnv
    })

    it("exposes the currently signed-in user", () => {
      const div = renderer
        .create(
          <Artsy.ContextProvider currentUser={currentUser}>
            <WithCurrentUser />
          </Artsy.ContextProvider>
        )
        .toJSON()
      expect(div.children[0]).toEqual("andy-warhol")
    })

    it("defaults to environment variables if available", () => {
      const div = renderer
        .create(
          <Artsy.ContextProvider>
            <WithCurrentUser />
          </Artsy.ContextProvider>
        )
        .toJSON()
      expect(div.children[0]).toEqual("user-id-from-env")
    })

    it("does not default to environment variables when explicitly passing null", () => {
      const div = renderer
        .create(
          <Artsy.ContextProvider currentUser={null}>
            <WithCurrentUser />
          </Artsy.ContextProvider>
        )
        .toJSON()
      expect(div.children[0]).toEqual("no-current-user")
    })
  })

  it("creates and exposes a Relay environment", () => {
    const div = renderer
      .create(
        <Artsy.ContextProvider currentUser={currentUser}>
          <WithRelayEnvironment />
        </Artsy.ContextProvider>
      )
      .toJSON()
    expect(div.children[0]).toEqual("A mocked env for andy-warhol")
  })

  it("exposes a passed in Relay environment", () => {
    const mockedEnv: any = { description: "A passed in mocked env" }
    const div = renderer
      .create(
        <Artsy.ContextProvider
          currentUser={currentUser}
          relayEnvironment={mockedEnv}
        >
          <WithRelayEnvironment />
        </Artsy.ContextProvider>
      )
      .toJSON()
    expect(div.children[0]).toEqual("A passed in mocked env")
  })

  it("passes other props on", () => {
    const div = renderer
      .create(
        <Artsy.ContextProvider currentUser={currentUser}>
          <WithCurrentUser additionalProp="friends" />
        </Artsy.ContextProvider>
      )
      .toJSON()
    expect(div.children[0]).toEqual("andy-warhol & friends")
  })

  it("throws an error when not embedded in a context provider", () => {
    global.console.error = jest.fn()
    expect(() => {
      renderer.create(<WithCurrentUser />)
    }).toThrowErrorMatchingSnapshot()
  })

  it("throws an error when trying to embed more than a single child in a context provider", () => {
    global.console.error = jest.fn()
    expect(() => {
      renderer.create(
        <Artsy.ContextProvider>
          <WithCurrentUser />
          <div />
        </Artsy.ContextProvider>
      )
    }).toThrowErrorMatchingSnapshot()
  })

  it("has a display name for React DevTools purposes", () => {
    expect(WithCurrentUser.displayName).toEqual("Artsy(ShowCurrentUser)")
  })
})
