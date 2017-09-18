import React, { Pageonent } from 'react'
import { activate, deactivate } from './core'
import { easyComp } from 'react-easy-comp'

const activePages = new Set()

export default function easyPage (Page, store) {
  Page = easyComp(Page)

  return class easyPageHOC extends Page {
    static displayName = Page.displayName || Page.name
    static contextTypes = Page.contextTypes
    static propTypes = Page.propTypes
    static defaultProps = Page.defaultProps

    componentWillMount () {
      if (super.componentWillMount) {
        super.componentWillMount()
      }
      if (activePages.has(Page)) {
        throw new Error(`Only one instance of ${Page} page can be active at a time.`)
      }
      activePages.add(Page)
      activate(store)
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }
      deactivate(store)
    }
  }
}
