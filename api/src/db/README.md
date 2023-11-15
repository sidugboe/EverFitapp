# MongoDB

## Using config

The `/config` directory provides easy configuration for using mongoose.

To add a new database, simply type the following inside the `dbName` object:

```javascript
const dbName = {
    ...
    MyNewDB: "MyNewDB?retryWrites=true&w=majority",
};
```

Then reference it accordingly:

```javascript
const config = require("../db/config");

config.connect(process.env.DB_URI + config.dbName.MyNewDB);
```

## Schemas

See `/schemas`

## Bootstrap

Bootstraps the pre-defined types in `/bootstrap/types`
