# API overview

The default export is the `Glare` class. Static helpers cover binding, opening, and looking up instances; methods on a returned instance control an open lightbox.

```ts
import Glare from '@redot-src/glare'
```

## Static methods

| Method | What it does |
| ------ | ------------ |
| [`Glare.bind`](/api/glare#glarebindtarget-options) | Attach click handlers that open a gallery from markup. |
| [`Glare.autoBind`](/api/glare#glareautobindoptions) | Bind every `[data-glare]` element once the DOM is ready. |
| [`Glare.open`](/api/glare#glareopenitems-options-index) | Open a new instance from slides or elements and return it. |
| [`Glare.close`](/api/glare#glarecloseall--false) | Close the topmost instance, or every instance when `all` is `true`. |
| [`Glare.getInstance`](/api/glare#glaregetinstanceid) | Return the topmost open instance, or the one with the given id. |
| [`Glare.getInstances`](/api/glare#glaregetinstances) | Return a copy of the open-instance stack. |
| [`Glare.destroy`](/api/glare#glaredestroy) | Close every instance and remove all `bind()` handlers. |
| [`Glare.defaults`](/api/glare#glaredefaults) | Mutable defaults object applied to instances created afterwards. |

## Reaching an instance

`Glare.open()` returns the instance directly. While a lightbox is open, read it again with `Glare.getInstance()` (topmost) or `Glare.getInstance(id)` using the `data-glare-id` on the container. Instance methods and properties are listed in [Instance](/api/instance). Types live in [TypeScript types](/api/types).
