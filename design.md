# sitewatcher2: design

## class diagram (overview)

```mermaid
classDiagram
  directory o-- site
  site o-- resource
  class directory {
    +uuid id
    +string name
    +string metadata
  }
  class site {
    +uuid directoryId
    +uuid id
    +string uri
    +string name
    +string metadata
  }
  class resource {
    +uuid site_id
    +string uri
    +string name
  }
```
