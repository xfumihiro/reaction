import { Sans } from "@artsy/palette"
import { Truncator } from "Components/Truncator"
import React from "react"
import styled from "styled-components"
import { DisplayProps } from "styled-system"

export interface ReadMoreProps extends DisplayProps {
  isExpanded?: boolean
  maxLineCount?: number
  onExpand?: () => void
}

export interface ReadMoreState {
  isExpanded: boolean
}

export class ReadMore extends React.Component<ReadMoreProps, ReadMoreState> {
  state = {
    isExpanded: false,
  }

  static defaultProps = {
    isExpanded: false,
    maxLineCount: 3,
  }

  constructor(props) {
    super(props)

    this.state = {
      isExpanded: props.isExpanded,
    }
  }

  expandText = () => {
    if (this.props.onExpand && !this.state.isExpanded) {
      this.props.onExpand()
    }
    this.setState({
      isExpanded: true,
    })
  }

  render() {
    const { isExpanded } = this.state
    const { maxLineCount } = this.props

    return (
      <Container onClick={this.expandText} isExpanded>
        {isExpanded ? (
          this.props.children
        ) : (
          <Truncator
            maxLineCount={maxLineCount}
            ReadMoreLink={() => <ReadMoreLink>Read more</ReadMoreLink>}
          >
            {this.props.children}
          </Truncator>
        )}
      </Container>
    )
  }
}

const ReadMoreLink = ({ children }) => {
  return (
    // TODO: Investigate why <Truncator />, when calling `renderToStaticMarkup`,
    // breaks the context chain requiring us to wrap ReadMore in a <Theme />

    <ReadMoreLinkContainer>
      ...{" "}
      <Sans size="2" weight="medium">
        {children}
      </Sans>
    </ReadMoreLinkContainer>
  )
}

const ReadMoreLinkContainer = styled.span`
  cursor: pointer;
  text-decoration: underline;
  display: inline-block;
`

const Container = styled.div.attrs<ReadMoreState>({})`
  cursor: ${p => (p.isExpanded ? "auto" : "pointer")};
`
