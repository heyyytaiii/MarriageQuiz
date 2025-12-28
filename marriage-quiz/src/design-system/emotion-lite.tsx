/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react'

type Interpolation = string | number | boolean | null | undefined

let styleElement: HTMLStyleElement | null = null

const ensureStyleElement = () => {
  if (styleElement) return styleElement

  styleElement = document.createElement('style')
  styleElement.setAttribute('data-app', 'design-system')
  document.head.appendChild(styleElement)
  return styleElement
}

const resolveInterpolations = (
  strings: TemplateStringsArray,
  interpolations: Interpolation[],
): string => {
  return strings.reduce((acc, part, index) => {
    const value = interpolations[index]
    return acc + part + (value ?? '')
  }, '')
}

let classCounter = 0

export const css = (strings: TemplateStringsArray, ...interpolations: Interpolation[]): string => {
  const raw = resolveInterpolations(strings, interpolations).trim()
  const className = `ds-${classCounter++}`
  const selector = `.${className}`

  const normalized = raw.includes('&') ? raw.replace(/&/g, selector) : `${selector}{${raw}}`

  const styleTag = ensureStyleElement()
  styleTag.appendChild(document.createTextNode(`${normalized}\n`))

  return className
}

export const cx = (...classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ')

export const GlobalStyles = ({ styles }: { styles: string }) => {
  useEffect(() => {
    const styleTag = document.createElement('style')
    styleTag.setAttribute('data-app', 'global-styles')
    styleTag.appendChild(document.createTextNode(styles))
    document.head.appendChild(styleTag)

    return () => {
      document.head.removeChild(styleTag)
    }
  }, [styles])

  return null
}
