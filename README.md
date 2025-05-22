# OpenAPI Transformer

Configurable openapi transformer that converts sigil framework custom route definitions and schema metadata into OpenAPI 3.0 JSON.


## Table of Contents

* [Installation](#installation)
* [Quick Start](#quick-start)
* [License](#license)


## Installation

```bash
npm add @sigiljs/openapi-transformer
# or
yarn add @sigiljs/openapi-transformer
```


## Quick Start

```ts
import OpenApiTransformer from "openapi-transformer"
import { generateRoutes } from "./your-route-definitions"

const transformer = new OpenApiTransformer({
  title: "My API",
  version: "1.0.0",
  responseTemplate: (content, error) => ({
    code: error ? error.code : 200,
    headers: {},
    content: JSON.stringify({ data: content, error })
  })
})

const openapi = transformer.transform(generateRoutes())
console.log(JSON.stringify(openapi, null, 2))
```


## License

You can copy and paste the MIT license summary from below.

```text
MIT License

Copyright (c) 2022-2025 Kurai Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
