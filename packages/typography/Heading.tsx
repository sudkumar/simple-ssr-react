import * as React from "react"

interface HeadingProps {
  level?: 1 | 2 | 3
  children: React.ReactNode
}

export function Heading({ level = 1, ...otherProps }: HeadingProps) {
  const Component = `h${level}`
  return <Component {...otherProps} />
}

export default Heading
