import { Sans } from "@artsy/palette"
import { ContextConsumer, ContextProps } from "Components/Artsy"
import React from "react"
import {
  createRefetchContainer,
  graphql,
  QueryRenderer,
  RelayRefetchProp,
} from "react-relay"
import { Pagination } from "Styleguide/Components/Pagination"
import { Box } from "Styleguide/Elements/Box"
import { Flex } from "Styleguide/Elements/Flex"
import { Col, Row } from "Styleguide/Elements/Grid"
import { Separator } from "Styleguide/Elements/Separator"
import { Spacer } from "Styleguide/Elements/Spacer"
import { paginationProps } from "Styleguide/Pages/Fixtures/Pagination"
import { Responsive } from "Styleguide/Utils/Responsive"
import { ShowBlockItem } from "./ShowBlockItem"
import { ShowListItem } from "./ShowListItem"

import { Shows_artist } from "__generated__/Shows_artist.graphql"

const ShowBlocks = Flex
const ShowList = Box
const Category = Sans

interface Props extends ContextProps {
  artistID: string
  status: string
  sort: string
}

interface ShowProps {
  relay: RelayRefetchProp
  artist: Shows_artist
}

const PAGE_SIZE = 4

class ShowsContainer extends React.Component<ShowProps> {
  loadPrev = () => {
    const {
      startCursor,
      hasPreviousPage,
    } = this.props.artist.showsConnection.pageInfo
    if (hasPreviousPage) {
      this.loadBefore(startCursor)
    }
  }

  loadNext = () => {
    const {
      hasNextPage,
      endCursor,
    } = this.props.artist.showsConnection.pageInfo
    if (hasNextPage) {
      this.loadAfter(endCursor)
    }
  }

  loadBefore(cursor) {
    this.props.relay.refetch(
      {
        first: null,
        before: cursor,
        artistID: this.props.artist.id,
        after: null,
        last: PAGE_SIZE,
      },
      null,
      error => {
        if (error) {
          console.error(error)
        }
      }
    )
  }

  loadAfter = cursor => {
    this.props.relay.refetch(
      {
        first: PAGE_SIZE,
        after: cursor,
        artistID: this.props.artist.id,
        before: null,
        last: null,
      },
      null,
      error => {
        if (error) {
          console.error(error)
        }
      }
    )
  }

  renderPagination() {
    return (
      <div>
        <Pagination
          {...this.props.artist.showsConnection.pageCursors}
          onClick={this.loadAfter}
          onNext={this.loadNext}
          onPrev={this.loadPrev}
        />
      </div>
    )
  }
  render() {
    return (
      <Responsive>
        {({ xs }) => {
          const blockWidth = xs ? "100%" : "50%"
          const blockDirection = xs ? "column" : "row"

          return (
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Category size="3" weight="medium">
                      Currently on view
                    </Category>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ShowBlocks
                      flexDirection={blockDirection}
                      wrap={"true" as any}
                    >
                      {this.props.artist.showsConnection.edges.map(
                        ({ node }) => {
                          return (
                            <ShowBlockItem
                              blockWidth={blockWidth}
                              imageUrl={node.cover_image.cropped.url}
                              partner={node.partner.name}
                              name={node.name}
                              exhibitionInfo={node.exhibition_period}
                            />
                          )
                        }
                      )}
                    </ShowBlocks>
                  </Col>
                </Row>

                <Box py={2}>
                  <Separator />
                </Box>

                <Row>
                  <Col>
                    <Flex justifyContent="flex-end">
                      {this.renderPagination()}
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        }}
      </Responsive>
    )
  }
}

// This is the actual Refetch Container we want to use.
const ShowsRefetchContainer = createRefetchContainer(
  ShowsContainer,
  {
    artist: graphql`
      fragment Shows_artist on Artist
        @argumentDefinitions(
          first: { type: "Int" }
          last: { type: "Int" }
          after: { type: "String" }
          before: { type: "String" }
          sort: { type: "PartnerShowSorts" }
          status: { type: "String" }
        ) {
        id
        showsConnection(
          first: $first
          after: $after
          before: $before
          last: $last
          sort: $sort
          status: $status
        ) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          pageCursors {
            around {
              cursor
              page
              isCurrent
            }
            first {
              cursor
              page
              isCurrent
            }
            last {
              cursor
              page
              isCurrent
            }
          }
          edges {
            node {
              partner {
                ... on ExternalPartner {
                  name
                }
                ... on Partner {
                  name
                }
              }
              name
              exhibition_period
              cover_image {
                cropped(width: 400, height: 300) {
                  url
                }
              }
            }
          }
        }
      }
    `,
  },
  graphql`
    query ShowsQuery(
      $first: Int
      $last: Int
      $after: String
      $before: String
      $artistID: String!
      $sort: PartnerShowSorts
      $status: String!
    ) {
      artist(id: $artistID) {
        ...Shows_artist
          @arguments(
            sort: $sort
            first: $first
            last: $last
            after: $after
            before: $before
            status: $status
          )
      }
    }
  `
)

class ShowsQueryRenderer extends React.Component<Props> {
  render() {
    const { artistID, relayEnvironment, status, sort } = this.props
    return (
      <QueryRenderer
        environment={relayEnvironment}
        query={graphql`
          query ShowsIndexQuery(
            $artistID: String!
            $first: Int!
            $sort: PartnerShowSorts
            $status: String!
          ) {
            artist(id: $artistID) {
              ...Shows_artist
                @arguments(sort: $sort, status: $status, first: $first)
            }
          }
        `}
        variables={{ artistID, first: PAGE_SIZE, status, sort }}
        render={({ props }) => {
          if (props) {
            return <ShowsRefetchContainer artist={props.artist} />
          } else {
            return null
          }
        }}
      />
    )
  }
}

export const ShowsContent = ContextConsumer(ShowsQueryRenderer)

export const Shows = () => {
  const { cursor, callbacks } = paginationProps

  return (
    <Responsive>
      {({ xs }) => {
        const blockWidth = xs ? "100%" : "50%"
        const blockDirection = xs ? "column" : "row"

        return (
          <React.Fragment>
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Category size="3" weight="medium">
                      Currently on view
                    </Category>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ShowBlocks
                      flexDirection={blockDirection}
                      wrap={"true" as any}
                    >
                      {/* <ShowBlockItem blockWidth={blockWidth} />
                      <ShowBlockItem blockWidth={blockWidth} />
                      <ShowBlockItem blockWidth={blockWidth} />
                      <ShowBlockItem blockWidth={blockWidth} /> */}
                    </ShowBlocks>
                  </Col>
                </Row>

                <Box py={2}>
                  <Separator />
                </Box>

                <Row>
                  <Col>
                    <Flex justifyContent="flex-end">
                      <Pagination {...cursor} {...callbacks} />
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Spacer mb={6} />

            <Row>
              <Col>
                <Row>
                  <Col>
                    <Category size="3" weight="medium">
                      Upcoming
                    </Category>
                  </Col>
                </Row>

                <Box py={1}>
                  <Separator />
                </Box>

                <Row>
                  <Col>
                    <ShowList>
                      <ShowListItem />
                      <ShowListItem />
                      <ShowListItem />
                    </ShowList>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Flex mb={2} justifyContent="flex-end">
                      <Pagination {...cursor} {...callbacks} />
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Spacer mb={6} />

            <Row>
              <Col>
                <Row>
                  <Col>
                    <Category size="3" weight="medium">
                      Past
                    </Category>
                  </Col>
                </Row>

                <Box py={1}>
                  <Separator />
                </Box>

                <Row>
                  <Col>
                    <ShowList>
                      <ShowListItem />
                      <ShowListItem />
                      <ShowListItem />
                    </ShowList>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Flex mb={3} justifyContent="flex-end">
                      <Pagination {...cursor} {...callbacks} />
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          </React.Fragment>
        )
      }}
    </Responsive>
  )
}
