# combo-script

### Usage

```
> npm i -g combo-script
> combo-script ./combo.json
```

Input: `combo.json`

```
{
  "dist": "dist.js",
  "resources": [
    {
      "name": "vue",
      "version": "2.5.13",
      "url": "https://unpkg.com/vue@2.5.13/dist/vue.runtime.min.js"
    },{
      "name": "vue-router",
      "version": "3.0.1",
      "path": "./assets/vue-router.min.js"
    }
  ]
}
```

Output: `dist.js`

```
/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
// ....
/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */

// ...
```
