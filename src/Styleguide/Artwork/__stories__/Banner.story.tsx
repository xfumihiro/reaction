import React from "react"
import { storiesOf } from "storybook/storiesOf"
import { Banner } from "../Banner"
import { Theme } from "../../theme"

storiesOf("Styleguide/Artwork", module).add("Banner", () => {
  return (
    <Theme>
      <Banner />
    </Theme>
  )
})
