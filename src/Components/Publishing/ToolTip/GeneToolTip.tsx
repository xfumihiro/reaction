import { garamond } from "Assets/Fonts"
import PropTypes from "prop-types"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import track from "react-tracking"
import styled from "styled-components"
import { GeneToolTip_gene } from "../../../__generated__/GeneToolTip_gene.graphql"
import FollowGeneButton from "../../FollowButton/FollowGeneButton"
import { FollowTrackingData } from "../../FollowButton/Typings"
import { getFullArtsyHref } from "../Constants"
import { ToolTipDescription } from "./Components/Description"
import { NewFeature, NewFeatureContainer } from "./Components/NewFeature"

export interface GeneProps {
  gene: GeneToolTip_gene
  tracking?: any
}

export class GeneToolTip extends React.Component<GeneProps> {
  static contextTypes = {
    tooltipsData: PropTypes.object,
    onOpenAuthModal: PropTypes.func,
  }

  trackClick = () => {
    const { tracking } = this.props
    const { href } = this.props.gene

    tracking.trackEvent({
      action: "Click",
      flow: "tooltip",
      type: "gene stub",
      context_module: "intext tooltip",
      destination_path: href,
    })
  }

  render() {
    const { description, href, id, _id, image, name } = this.props.gene
    const { url } = image
    const {
      tooltipsData: { genes },
      onOpenAuthModal,
    } = this.context

    const trackingData: FollowTrackingData = {
      context_module: "tooltip",
      entity_id: _id,
      entity_slug: id,
      entity_type: "gene",
    }

    return (
      <Wrapper>
        <GeneContainer
          href={getFullArtsyHref(href)}
          target="_blank"
          onClick={this.trackClick}
        >
          {url && <Image src={url} />}
          <Title>{name}</Title>

          {description && <ToolTipDescription text={description} />}
        </GeneContainer>

        <ToolTipFooter>
          <FollowGeneButton
            gene={genes[id] as any}
            trackingData={trackingData}
            onOpenAuthModal={onOpenAuthModal}
          />
          <NewFeature />
        </ToolTipFooter>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 240px;
  a:hover {
    color: black;
  }
`

export const GeneContainer = styled.a`
  position: relative;
  text-decoration: none;
  color: black;
  padding-bottom: 10px;
`

const Title = styled.div`
  ${garamond("s18")};
  font-weight: 600;
  padding-bottom: 10px;
`

const Image = styled.img`
  width: 100%;
  padding-bottom: 10px;
  max-height: 160px;
  object-fit: cover;
`

export const ToolTipFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${NewFeatureContainer} {
    display: flex;
    flex-direction: column;
  }
`

export const GeneToolTipContainer = track()(
  createFragmentContainer(
    GeneToolTip,
    graphql`
      fragment GeneToolTip_gene on Gene {
        description
        href
        id
        _id
        image {
          url(version: "tall")
        }
        name
      }
    `
  )
)
