import * as React from "react"

interface ButtonProps {
  children: React.ReactNode
}

export function Button(props: ButtonProps) {
  return <button type="button" {...props} />
}

export default Button
