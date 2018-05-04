import { compact, map } from "lodash"
import PropTypes from "prop-types"
import React from "react"

export const EditableChild = type => {
  return <div>Child {type}</div>
}

export const TextFromArticle = article => {
  return compact(map(article.sections, "body")).join("")
}

export const wrapperWithContext = (context, contextTypes, children) => {
  class WrapperWithContext extends React.Component {
    static childContextTypes = contextTypes
    getChildContext() {
      return context
    }
    render() {
      return children
    }
  }
  return React.createElement(WrapperWithContext)
}

const FullscreenViewerContext = {
  onViewFullscreen: x => x,
  openViewer: x => x,
  closeViewer: x => x,
  slideIndex: 0,
  viewerIsOpen: false,
}

const FullscreenViewerContextTypes = {
  onViewFullscreen: PropTypes.func,
  openViewer: PropTypes.func,
  closeViewer: PropTypes.func,
  slideIndex: PropTypes.number,
  viewerIsOpen: PropTypes.bool,
}

export const WrapperWithFullscreenContext = children => {
  return wrapperWithContext(
    FullscreenViewerContext,
    FullscreenViewerContextTypes,
    children
  )
}
