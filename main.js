const checkPositions = (actions) => {
  actions.map((action) => {
    action.elements.map((el) => {
      const rect = el.DOMElement.getBoundingClientRect()
      const elHeight = el.DOMElement.offsetHeight
      const offset = action.offsetPerc ? (window.innerHeight * action.offsetPerc/100) : 0

      if (
        rect.left < 0 ||
        rect.right > window.innerWidth
      ) { return }

      if (
        rect.top >= -elHeight &&
        rect.bottom <= window.innerHeight + elHeight - offset
      ) {
        if (action.inView) {
          action.inView(el.DOMElement)
        }
        if (action.onEnter && !el.isInViewport) {
          action.onEnter(el.DOMElement)
          el.isInViewport = true
        }
      } else if (action.onLeave && el.isInViewport) {
        action.onLeave(el.DOMElement)
        el.isInViewport = false
      }
    })
  })
}

export default function scrollActions (conf) {
  const actions = conf.actions
    .map((action) => {
      return {
        elements: action.selectors
          .map((sel) => {
            return {
              DOMElement: document.querySelectorAll(sel)[0],
              isInViewport: false,
            }
          })
          .filter((el) => !!el.DOMElement),
        ...action
      }
    })

  // initial check, then tether to scroll
  checkPositions(actions)
  window.onscroll = () => checkPositions(actions)
}
