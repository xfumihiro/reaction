import { avantgarde, garamond } from "Assets/Fonts"
import { get } from "lodash"
import React from "react"
import track from "react-tracking"
import Waypoint from "react-waypoint"
import styled, { StyledFunction } from "styled-components"
import Colors from "../../../../Assets/Colors"
import { ErrorBoundary } from "../../../ErrorBoundary"
import { pMedia } from "../../../Helpers"
import { getCurrentUnixTimestamp } from "../../Constants"
import { PixelTracker, replaceWithCacheBuster } from "../ExternalTrackers"
import { trackImpression, trackViewability } from "../track-once"
import { CanvasContainer, unitLayout } from "./CanvasContainer"

interface DisplayCanvasProps {
  unit: any
  campaign: any
  article?: any
  renderTime?: string
}

interface DivProps extends React.HTMLProps<HTMLDivElement> {
  layout: string
}

@track()
export class DisplayCanvas extends React.Component<DisplayCanvasProps> {
  constructor(props) {
    super(props)
    this.trackViewability = this.trackViewability.bind(this)
    this.trackImpression = this.trackImpression.bind(this)
  }

  @trackImpression(props => unitLayout(props))
  trackImpression() {
    // noop
  }

  @trackViewability(props => unitLayout(props))
  trackViewability() {
    // noop
  }

  render() {
    const { unit, campaign, article, renderTime } = this.props
    const url = get(unit, "link.url", "")
    const disclaimer = (
      <Disclaimer layout={unit.layout}>{unit.disclaimer}</Disclaimer>
    )

    return (
      <ErrorBoundary>
        <DisplayContainer layout={unit.layout}>
          <Waypoint onEnter={this.trackImpression} />
          <Waypoint bottomOffset="50%" onEnter={this.trackViewability} />

          <a
            href={replaceWithCacheBuster(url, getCurrentUnixTimestamp())}
            target="_blank"
          >
            <SponsoredBy>{`Sponsored by ${campaign.name}`}</SponsoredBy>
          </a>

          <CanvasContainer
            unit={unit}
            campaign={campaign}
            article={article}
            disclaimer={disclaimer}
          />

          {unit.layout === "overlay" && disclaimer}
          <PixelTracker unit={unit} date={renderTime} />
        </DisplayContainer>
      </ErrorBoundary>
    )
  }
}

const Div: StyledFunction<DivProps> = styled.div

const DisplayContainer = Div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${props => (props.layout === "slideshow" ? "100%;" : "1250px;")}
  margin: 0 auto;
  margin-bottom: -44px; // Offset default force margin; FIXME: This kind of stuff needs to be globally addressed
  box-sizing: border-box;
  a {
    text-decoration: none;
  }
  ${pMedia.sm`
    margin-bottom: 0;
    min-height: 400px;
  `}
`
const SponsoredBy = styled.div`
  ${avantgarde("s11")} color: ${Colors.grayMedium};
  margin: 10px 0;
  text-align: center;
`
const Disclaimer = Div`
  ${garamond("s11")}
  color: ${Colors.grayMedium};
  margin: 15px 0 0 0;
  ${props => props.layout === "overlay" && "text-align: center;"}
  ${pMedia.sm`
    margin: 35px 0 10px 0;
  `}
`
