# scroll-actions

Actions on scrolling to an element

```javascript
import scrollActions from 'scroll-actions'

scrollActions({
  actions: [
    {
      selectors: ['#some-element'],
      onEnter: (el) => {
        // #some-element entered view
      },
      onLeave: (el) => {
        // #some-element left view
      },
    },
  ]
})
```
