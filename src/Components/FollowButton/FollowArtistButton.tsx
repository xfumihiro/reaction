import { extend } from "lodash"
import React from "react"
import track from "react-tracking"
import { RecordSourceSelectorProxy, SelectorData } from "relay-runtime"
import { FollowArtistButton_artist } from "../../__generated__/FollowArtistButton_artist.graphql"
import * as Artsy from "../Artsy"
import { FollowButton } from "./Button"
import { FollowButtonDeprecated } from "./ButtonDeprecated"
import { FollowTrackingData } from "./Typings"

import {
  commitMutation,
  createFragmentContainer,
  graphql,
  RelayProp,
} from "react-relay"
import { ButtonProps } from "Styleguide/Elements/Button"

interface Props
  extends React.HTMLProps<FollowArtistButton>,
    Artsy.ContextProps {
  relay?: RelayProp
  artist?: FollowArtistButton_artist
  tracking?: any
  trackingData?: FollowTrackingData
  onOpenAuthModal?: (type: "register" | "login", config?: Object) => void

  /**
   * FIXME: Default is true due to legacy code. If false, use new @artsy/palette
   * design system <Button /> style.
   */
  useDeprecatedButtonStyle?: boolean
  /**
   * FIXME: If useDeprecatedButtonStyle is false pass <Button> style props along
   * to new design-system buttons.
   */
  buttonProps?: Partial<ButtonProps>
}

export class FollowArtistButton extends React.Component<Props> {
  static defaultProps = {
    useDeprecatedButtonStyle: true,
    buttonProps: {},
  }

  trackFollow = () => {
    const {
      tracking,
      artist: { is_followed },
    } = this.props
    const trackingData: FollowTrackingData = this.props.trackingData || {}
    const action = is_followed ? "Unfollowed Artist" : "Followed Artist"

    tracking.trackEvent(extend({ action }, trackingData))
  }

  handleFollow = e => {
    e.preventDefault() // If this button is part of a link, we _probably_ dont want to actually follow the link.
    const { artist, currentUser, relay, onOpenAuthModal } = this.props

    if (currentUser && currentUser.id) {
      const newFollowCount = artist.is_followed
        ? artist.counts.follows - 1
        : artist.counts.follows + 1
      commitMutation(relay.environment, {
        mutation: graphql`
          mutation FollowArtistButtonMutation($input: FollowArtistInput!) {
            followArtist(input: $input) {
              artist {
                is_followed
                counts {
                  follows
                }
              }
            }
          }
        `,
        variables: {
          input: { artist_id: artist.id, unfollow: artist.is_followed },
        },
        optimisticResponse: {
          followArtist: {
            artist: {
              __id: artist.__id,
              is_followed: !artist.is_followed,
              counts: { follows: newFollowCount },
            },
          },
        },
        updater: (store: RecordSourceSelectorProxy, data: SelectorData) => {
          const artistProxy = store.get(data.followArtist.artist.__id)

          artistProxy
            .getLinkedRecord("counts")
            .setValue(newFollowCount, "follows")
        },
      })
      this.trackFollow()
    } else {
      onOpenAuthModal &&
        onOpenAuthModal("register", {
          context_module: "intext tooltip",
          intent: "follow artist",
          copy: "Sign up to follow artists",
        })
    }
  }

  render() {
    const { artist, useDeprecatedButtonStyle, buttonProps } = this.props

    // FIXME: Unify design language
    const Button = useDeprecatedButtonStyle
      ? FollowButtonDeprecated
      : FollowButton

    return (
      <Button
        isFollowed={artist && artist.is_followed}
        handleFollow={this.handleFollow}
        buttonProps={buttonProps}
      />
    )
  }
}

export default track()(
  createFragmentContainer(
    Artsy.ContextConsumer(FollowArtistButton),
    graphql`
      fragment FollowArtistButton_artist on Artist {
        __id
        id
        is_followed
        counts {
          follows
        }
      }
    `
  )
)
