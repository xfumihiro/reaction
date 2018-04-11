import { get, omit } from "lodash"
import React from "react"
import styled from "styled-components"
import Colors from "../../../Assets/Colors"
import { Responsive } from "../../../Utils/Responsive"
import { pMedia } from "../../Helpers"
import { DisplayCanvas } from "../Display/Canvas"
import { DisplayPanel } from "../Display/DisplayPanel"
import { EmailPanel } from "../Email/EmailPanel"
import { Header } from "../Header/Header"
import { ReadMore } from "../ReadMore/ReadMoreButton"
import { ReadMoreWrapper } from "../ReadMore/ReadMoreWrapper"
import { RelatedArticlesCanvas } from "../RelatedArticles/RelatedArticlesCanvas"
import { RelatedArticlesPanel } from "../RelatedArticles/RelatedArticlesPanel"
import { Sections } from "../Sections/Sections"
import { ArticleData } from "../Typings"
import { Sidebar } from "./Components/Sidebar"

export interface ArticleProps {
  article: ArticleData
  seriesArticle?: ArticleData
  closeViewer?: () => void
  display?: {
    name: string
    panel: object
    canvas: any
  }
  emailSignupUrl?: string
  headerHeight?: string
  isMobile?: boolean
  isSuper?: boolean
  isTruncated?: boolean
  marginTop?: string
  relatedArticlesForCanvas?: any
  relatedArticlesForPanel?: any
  slideIndex?: number
  viewerIsOpen?: boolean
}

interface ArticleState {
  isTruncated: boolean
}

export class StandardLayout extends React.Component<
  ArticleProps,
  ArticleState
> {
  static defaultProps = {
    isMobile: false,
    isSuper: false,
    article: {},
    isTruncated: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      isTruncated: props.isTruncated || false,
    }
  }

  removeTruncation = () => {
    this.setState({ isTruncated: false })
  }

  displayPanelAd = isMobileAd => {
    const { article, display } = this.props

    const hasPanel = get(display, "panel", false)
    const campaign = omit(display, "panel", "canvas")

    if (hasPanel) {
      return (
        <DisplayPanel
          isMobile={isMobileAd}
          unit={display.panel}
          campaign={campaign}
          article={article}
        />
      )
    }
  }

  render() {
    const {
      article,
      display,
      emailSignupUrl,
      relatedArticlesForCanvas,
      relatedArticlesForPanel,
    } = this.props
    const { isTruncated } = this.state

    const campaign = omit(display, "panel", "canvas")
    const displayOverflows = display && display.canvas.layout === "slideshow"

    return (
      <Responsive initialState={{ isMobile: this.props.isMobile }}>
        {({ isMobile, xs, sm, md }) => {
          const isMobileAd = Boolean(isMobile || xs || sm || md)

          return (
            <div>
              <ReadMoreWrapper
                isTruncated={isTruncated}
                hideButton={this.removeTruncation}
              >
                <Header article={article} isMobile={isMobile} />

                <StandardLayoutParent>
                  <StandardLayoutContainer>
                    <Sections
                      DisplayPanel={this.displayPanelAd(isMobileAd)}
                      article={article}
                      isMobile={isMobile}
                    />

                    <Sidebar>
                      {emailSignupUrl && (
                        <SidebarItem>
                          <EmailPanel signupUrl={emailSignupUrl} />
                        </SidebarItem>
                      )}

                      {relatedArticlesForPanel && (
                        <SidebarItem>
                          <RelatedArticlesPanel
                            label={"Related Stories"}
                            articles={relatedArticlesForPanel}
                          />
                        </SidebarItem>
                      )}

                      {/*
                        Display Ad
                      */}
                      {!isMobileAd &&
                        display &&
                        this.displayPanelAd(isMobileAd)}
                    </Sidebar>
                  </StandardLayoutContainer>
                </StandardLayoutParent>

                {/*
                  Canvas: Related Articles
                */}
                {relatedArticlesForCanvas && (
                  <div>
                    <LineBreak />
                    <RelatedArticlesCanvas
                      articles={relatedArticlesForCanvas}
                      isMobile={isMobile}
                      vertical={article.vertical}
                    />
                  </div>
                )}
              </ReadMoreWrapper>

              {/*
                Read More Button
              */}
              {isTruncated && <ReadMore onClick={this.removeTruncation} />}

              {/*
                Footer
              */}
              {display && (
                <div>
                  <LineBreak />

                  {displayOverflows ? (
                    <div>
                      <DisplayCanvas
                        unit={display.canvas}
                        campaign={campaign}
                        article={article}
                      />
                    </div>
                  ) : (
                    <FooterContainer>
                      <DisplayCanvas
                        unit={display.canvas}
                        campaign={campaign}
                        article={article}
                      />
                    </FooterContainer>
                  )}
                </div>
              )}
            </div>
          )
        }}
      </Responsive>
    )
  }
}

export const StandardLayoutParent = styled.div`
  margin: 0 40px 100px 40px;
  ${pMedia.sm`
    margin: 0 0 100px 0;
  `};
`

const StandardLayoutContainer = styled.div`
  max-width: 1250px;
  display: flex;
  margin: auto;
  justify-content: space-between;
`

const LineBreak = styled.div`
  border-top: 1px solid ${Colors.grayRegular};
  width: 100%;
`

const SidebarItem = styled.div`
  margin-bottom: 40px;
`

const FooterContainer = styled.div`
  margin: 0 40px;
  ${pMedia.sm`
    margin: 0 20px;
  `};
`
