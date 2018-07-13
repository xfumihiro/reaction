import { Sans } from "@artsy/palette"
import { Overview_artist } from "__generated__/Overview_artist.graphql"
import { Track, track as _track } from "Analytics"
import * as Schema from "Analytics/Schema"
import { ArtworkFilterFragmentContainer as ArtworkFilter } from "Apps/Artist/Routes/Overview/Components/ArtworkFilter"
import { GenesFragmentContainer as Genes } from "Apps/Artist/Routes/Overview/Components/Genes"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistBioFragmentContainer as ArtistBio } from "Styleguide/Components/ArtistBio"
import { MarketInsightsFragmentContainer as MarketInsights } from "Styleguide/Components/MarketInsights"
import { SelectedExhibitionFragmentContainer as SelectedExhibitions } from "Styleguide/Components/SelectedExhibitions"
import { Box } from "Styleguide/Elements/Box"
import { Col, Row } from "Styleguide/Elements/Grid"
import { Spacer } from "Styleguide/Elements/Spacer"
import { CurrentEventFragmentContainer as CurrentEvent } from "./Components/CurrentEvent"

export interface OverviewRouteProps {
  artist: Overview_artist
}

const track: Track<OverviewRouteProps> = _track

@track({ context_module: "Artist overview" })
class OverviewRoute extends React.Component<OverviewRouteProps> {
  // FIXME: Something must be wrong with the typings, because if I leave out the
  //        _state parameter TS selects a different function signature.
  @track((props, _state) => ({
    action_type: Schema.ActionTypes.Click,
    action_name: Schema.ActionNames.ConsignmentInterest,
    type: "Link",
    // TODO: This is no longer in the header
    // context_module: "Artist header",
    destination_path: props.artist.href,
  }))
  handleConsignClick() {
    // no-op
  }

  render() {
    const { artist } = this.props

    return (
      <React.Fragment>
        <Row>
          <Col sm={9}>
            <MarketInsights artist={artist as any} />
            <Spacer mb={1} />

            <SelectedExhibitions
              artistID={artist.id}
              totalExhibitions={artist.counts.partner_shows}
              exhibitions={artist.exhibition_highlights as any}
            />

            <Box mt={3} mb={1}>
              <ArtistBio bio={artist as any} />
            </Box>

            <Genes artist={artist as any} />

            <Spacer mb={1} />

            {artist.is_consignable && (
              <Sans size="2" color="black60">
                <a href="/consign" onClick={this.handleConsignClick.bind(this)}>
                  Consign
                </a>{" "}
                a work by this artist.
              </Sans>
            )}
          </Col>
          <Col sm={3}>
            <Box pl={2}>
              <CurrentEvent artist={artist as any} />
            </Box>
          </Col>
        </Row>

        <Spacer mb={4} />

        <Row>
          <Col>
            <span id="jump--artistArtworkGrid" />

            <ArtworkFilter artist={artist as any} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export const OverviewRouteFragmentContainer = createFragmentContainer(
  OverviewRoute,
  graphql`
    fragment Overview_artist on Artist {
      ...ArtistHeader_artist
      ...ArtistBio_bio
      ...CurrentEvent_artist
      ...MarketInsightsArtistPage_artist
      id
      exhibition_highlights(size: 3) {
        ...SelectedExhibitions_exhibitions
      }
      counts {
        partner_shows
      }

      href
      is_consignable

      ...Genes_artist

      ...ArtworkFilter_artist
    }
  `
)
