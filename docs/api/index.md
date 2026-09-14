# API overview

The default export is the `Glare` class. Static helpers cover the common cases; instance methods control an open lightbox.

```ts
import Glare from '@redot-src/glare'

Glare.bind(target, options?)
Glare.autoBind(options?)
Glare.open(items, options?, index?)
Glare.close(all?)
Glare.getInstance(id?)
Glare.getInstances()
Glare.destroy()
Glare.defaults
```

See:

- [Glare static API](/api/glare)
- [Instance methods](/api/instance)
- [TypeScript types](/api/types)
