# API overview

The default export is the `Glare` class. Static helpers cover the common cases; instance methods control an open lightbox.

```ts
import Glare from 'glare'

Glare.bind(selector, options?)
Glare.open(items, options?, index?)
Glare.close(all?)
Glare.getInstance(id?)
Glare.destroy()
Glare.defaults
```

See:

- [Glare static API](/api/glare)
- [Instance methods](/api/instance)
- [TypeScript types](/api/types)
