import { storiesOf } from "@storybook/react"
import React from "react"

storiesOf("Core/Tokens", module)
  .add("Color", () => <div />)
  .add("Typography", () => <div />)
  .add("Spacing", () => <div />)

storiesOf("Core/Elements", module)
  .add("Alert Banner", () => <div />)
  .add("Avatar", () => <div />)
  .add("Buttons", () => <div />)
  .add("Blocks", () => <div />)
  .add("Grid", () => <div />)
  .add("Icons", () => <div />)
  .add("Inputs", () => <div />)
  .add("Selects", () => <div />)
  .add("Pagination", () => <div />)
  .add("Nagivation", () => <div />)

storiesOf("Core/Components", module).add("placeholder", () => <div />)

storiesOf("Partner Components", module).add("placeholder", () => <div />)

storiesOf("Collector Components", module).add("placeholder", () => <div />)
