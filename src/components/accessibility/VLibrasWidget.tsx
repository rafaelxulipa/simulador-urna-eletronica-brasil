import { useEffect } from 'react'

/**
 * Embeds the official federal government (gov.br) Libras translation widget
 * — a free public accessibility tool, distinct from any TSE-specific asset,
 * so no copyright/licensing concern like the urna's own audio. Fulfills the
 * Libras item flagged as future work in docs/accessibility.md (no reusable
 * official urna interpreter exists, so this is the honest alternative
 * rather than inventing our own interpretation).
 */
export function VLibrasWidget() {
  useEffect(() => {
    const container = document.createElement('div')
    container.setAttribute('vw', '')
    container.className = 'enabled'

    const accessButton = document.createElement('div')
    accessButton.setAttribute('vw-access-button', '')
    accessButton.className = 'active'

    const pluginWrapper = document.createElement('div')
    pluginWrapper.setAttribute('vw-plugin-wrapper', '')
    const topWrapper = document.createElement('div')
    topWrapper.className = 'vw-plugin-top-wrapper'
    pluginWrapper.appendChild(topWrapper)

    container.appendChild(accessButton)
    container.appendChild(pluginWrapper)
    document.body.appendChild(container)

    const script = document.createElement('script')
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.async = true
    script.onload = () => {
      const w = window as typeof window & { VLibras?: { Widget: new (url: string) => unknown } }
      if (w.VLibras) new w.VLibras.Widget('https://vlibras.gov.br/app')
    }
    document.body.appendChild(script)

    return () => {
      container.remove()
      script.remove()
    }
  }, [])

  return null
}
