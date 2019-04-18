import * as React from "react"

interface ICard {
  border?: number
  children: React.ReactNode
}
export function Card(props: ICard) {
  return <div {...props} />
}

export default Card
