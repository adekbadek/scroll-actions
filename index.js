import throttle from 'lodash/throttle'
import { flatten } from 'ramda'

const checkPositions = (actions, firstInvocation = false) => {
  actions.map(action => {
    action.elements.map(el => {
      const winHeight = window.innerHeight
      const rect = el.DOMElement.getBoundingClientRect()
      const elHeight = el.DOMElement.offsetHeight
      const offset = action.offsetPerc && !firstInvocation ? (winHeight * action.offsetPerc/100) : 0

      if (
        rect.right < 0 ||
        rect.left > window.innerWidth
      ) { return }

      if (
        rect.top >= 0 &&
        winHeight - rect.bottom > 0
      ) {
        action.fullInViewEnter && action.fullInViewEnter(el.DOMElement)
      } else {
        action.fullInViewLeave && action.fullInViewLeave(el.DOMElement)
      }

      if (
        rect.top >= -elHeight &&
        rect.bottom <= winHeight + elHeight - offset
      ) {
        if (action.inView) {
          action.inView(el.DOMElement)
        }
        if (action.onEnter && !el.isInViewport) {
          if (firstInvocation) {
            setTimeout(() => {
              action.onEnter(el.DOMElement)
            }, 1)
          } else {
            action.onEnter(el.DOMElement)
          }
          el.isInViewport = true
        }
      } else if (action.onLeave && el.isInViewport) {
        action.onLeave(el.DOMElement)
        el.isInViewport = false
      }
    })
  })
}

export default (config) => {
  const actions = config.actions.map(action => {
    if (action.selectors.length === 0) {
      throw new Error('action.selectors must have at least one element')
    }
    const elements = flatten(action.selectors.map(
      sel => document.querySelectorAll(sel)
    ))
    return {
      elements: elements.map(DOMElement => {
        return {
          DOMElement,
          isInViewport: false,
        }
      }),
      ...action
    }
  })

  // initial check, then tether to scroll
  checkPositions(actions, true)
  const checkPositionsInThrottle = () => checkPositions(actions)
  window.addEventListener('scroll', throttle(checkPositionsInThrottle, 200))
}
