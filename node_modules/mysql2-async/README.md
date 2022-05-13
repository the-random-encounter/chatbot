# mysql2-async
A wrapper for mysql2 to add convenience, especially when developing with async/await and async iterables.

# Overview
This library has a few core principles:
* Focus on promises and async iterators, do away with callbacks and event-emitting streams
* Make advanced usage optional but easy, e.g.:
  * transactions
  * streaming large result sets
  * prepared statements
* Make it difficult to make a mistake, e.g.:
  * Always use a connection pool
  * Hide everything having to do with acquiring/releasing connections
  * Fix timezones (by default) so that we are always storing UTC in the database

# Getting Started
## Standard connection
Works just like creating a mysql2 pool. You will want to make a single pool and export it so that it can
be imported all over your code.
```javascript
import Db from 'mysql2-async'
export const db = new Db({
  host: 'yourhost',
  ...
})

async function main() {
  const row = await db.getrow('SELECT ...')
}
main().catch(e => console.error(e))
```
## Connect with environment variables
When working in docker, it's common to keep database configuration in environment variables. In order to
make that easy, this library provides a convenient way to import a pool instance that has already been
created and configured with the following environment variables:
```
  MYSQL_HOST (default 'localhost')
  MYSQL_PORT (default '3306')
  MYSQL_DATABASE (default 'default_database')
  MYSQL_USER (default 'root')
  MYSQL_PASS
  MYSQL_POOL_SIZE (default is mysql2's default)
  MYSQL_SKIPTZFIX (default false) // see below discussion of the timezone fix
```
This way, connecting is very simple, and you don't have to worry about creating and exporting the pool for the
rest of your codebase:
```javascript
import db from 'mysql2-async/db'

async function main() {
  const row = await db.getrow('SELECT ...')
}
main().catch(e => console.error(e))
```

## CommonJS imports
You must refer to `.default` when importing with `require`:
```javascript
const Db = require('mysql2-async').default
// or the instance created with environment variables (see above)
const db = require('mysql2-async/db').default
```

# Basic Usage
A lot of convenience methods are provided that allow you to specify the kind of operation you are about
to do and the kind of return data you expect.
## Querying
```javascript
const rows = await db.getall('SELECT name FROM mytable')
console.log(rows) // [{ name: 'John' }, { name: 'Maria' }, ...]
const row = await db.getrow('SELECT name FROM mytable WHERE name=?', ['John'])
console.log(row) // { name: 'John' }
const name = await db.getval('SELECT name FROM mytable WHERE name=?', ['John'])
console.log(name) // John
const names = await db.getvals('SELECT name FROM mytable WHERE name IN (:name1, :name2)',
  { name1: 'John', name2: 'Maria' })
console.log(names) // ['John', 'Maria']
```
## Named parameters
As you can see in the `getvals` example in the previous section, mysql2's named parameter support works
here as well.
## Mutating
```javascript
const insertId = await db.insert('INSERT INTO mytable (name) VALUES (?)', ['Mike'])
const rowsUpdated = await db.update('UPDATE mytable SET name=? WHERE name=?', ['Johnny', 'John'])
const success = await db.execute('CREATE TABLE anothertable ...')
```
## Raw query
If the convenience methods are hiding something you need from mysql2, you can use .query() to get
back whatever would have been returned by mysql2 (inside a promise, however).
```javascript
const result = await db.query('INSERT INTO mytable (name) VALUES (?)', ['Mike'])
const insertId = result.insertId
```
## IN helper
Writing queries with `IN` operators can be a little complicated, especially when using named parameters.
A helper is provided that takes your existing bound parameters array/object and an array to be used for the `IN`.
It generates the SQL while also mutating your existing bound parameters, so that you can easily use it inline.
```javascript
const binds = { author: authorid }
const rows = db.getall(`
  SELECT * FROM mytable
  WHERE author = :author
  AND (
    genre IN (${db.in(binds, genres)}) OR
    title IN (${db.in(binds, titles)})
  )`, binds)
```
# Advanced Usage
## Streaming
### Async Iterable
The async iterable approach is by far the simplest. It works almost exactly like `.getall()`, except
the advantage here is that it does not load the entire result set into memory at one time, which will help
you avoid out-of-memory issues when dealing with thousands or millions of rows.
```javascript
const stream = db.stream('SELECT name FROM mytable')
for await (const row of stream) {
  // work on the row
}
```
`for await` is very safe, as `break`ing the loop or throwing an error inside the loop will clean up the stream appropriately.

Note that `.stream()` returns a node `Readable` in object mode, so you can easily do other things with
it like `.pipe()` it to another stream processor. When using the stream without `for await`, you must call `stream.destroy` if you do not want to finish processing it and carefully use `try {} finally {}` to destroy it in case your code throws an error. Failure to do so will leak a connection from the pool.
### Iterator .next()
Another available approach is to use the iterator pattern directly. This is a standard javascript iterator
that you would receive from anything that supports the async iterator pattern. Probably to be avoided unless
you are working with multiple result sets at the same time (e.g. syncing two tables).
```javascript
const iterator1 = db.iterator('SELECT name FROM mytable')
const iterator2 = db.iterator('SELECT * FROM anothertable')
while (true) {
  const { value: row1, done1 } = await iterator1.next()
  const { value: row2, done2 } = await iterator2.next()
  if (!done1 || !done2) {
    try {
      // do some work to sync the rows
    } catch (e) {
      await iterator1.return()
      await iterator2.return()
      throw e
    }
  } else {
    break
  }
}
```
As illustrated above, an iterator needs to be cleaned up when your code is aborted before reaching the end, or it will leak a connection. Remember to `await iterator.return()` if you are going to abandon the iterator, and inside try/catch/finally blocks in your row processing code. An SQL query error will show up on the first `await iterator.next()` and does not need to be cleaned up.
## Transactions
A method is provided to support working inside a transaction. Since the core Db object is a mysql pool, you
cannot send transaction commands without this method, as each command would end up on a different connection.

To start a transaction, provide a callback that MUST return a promise (just make it async). A new instance of
`db` is provided to the callback; it represents a single connection, inside a transaction. Remember to pass this along to any other functions you call during the transaction - __if you call a function that uses the global `db` object its work will happen outside the transaction!__

You do NOT send `START TRANSACTION`, `ROLLBACK`, or `COMMIT` as these are handled automatically.
```javascript
await db.transaction(async db => {
  // both of these queries happen in the same transaction
  const row = await db.getrow('SELECT * FROM ...')
  await db.update('UPDATE mytable SET ...')
})
```
If you need to roll back, simply throw an error. Similarly, any query that throws an error will trigger
a rollback.
```javascript
await db.transaction(async db => {
  const id = await db.insert('INSERT INTO user ...')
  throw new Error('oops!')
}) // the INSERT will be rolled back and will not happen
```
### Retrying Deadlocks
`db.transaction()` accepts an `options` parameter allowing you to set a maximum number of retries allowed upon deadlock:
```javascript
await db.transaction(async db => {
  const row = await db.getrow('SELECT * FROM ...')
  await db.update('UPDATE mytable SET ...')
}, { retries: 1 })
```
If this transaction is the loser of a deadlock, it will retry the whole transaction once, including refetching the `getrow` statement.

## Prepared Statements
Prepared statements are nearly automatic, you just need to notate which queries need it. It's desirable to
carefully pick a few complicated queries because each unique SQL string that uses prepared statement support
will use up a small amount of resources on both client and server.
```javascript
await db.getrow('SELECT m.*, o.* FROM mytable m, othertable o WHERE ...complicated...',
  [ /* bind parameters */ ],
  { saveAsPrepared: true }
)
```
Now, future calls with this same SQL statement (before inserting bound parameters) will be able to skip the
query planning stage on the mysql server and return data a little bit faster.

Note that this is just a pass-through to mysql2's prepared statement implementation, so you can refer to
their documentation / code for more details.
## Timezone Fix
Working with timezones can be very confusing. This library takes an opinionated approach and sets it up so
that all dates will be stored as UTC, whether the date is set automatically on the server through a
`DEFAULT CURRENT_TIMESTAMP` setting, set with a server-side function such as `NOW()`, or sent from the client
as a javascript Date() object.

Older versions of mysql (less than 5.1) may throw an error because of this. If you need to work with a server
running an old version of mysql, or an existing database that does not or has not stored dates as UTC in the past,
you may set the `skiptzfix` configuration variable and then be very careful while handling dates.
```javascript
const db = new Db({ skiptzfix: true })
```
## Typescript
This library is written in typescript and provides its own types. For added convenience, methods that return
rows or values will accept a generic so that you can specify the return type you expect:
```typescript
interface Book {
  id: number
  title: string
  isbn: string
}
const row = await db.getrow<Book>('SELECT id, title, isbn FROM books WHERE id=?', [5])
// `row` is a `Book`
const rows = await db.getall<Book>('SELECT id, title, isbn FROM books')
// `rows` is a `Book[]`
const stream = db.stream<Book>('SELECT id, title, isbn FROM books')
for await (const row of stream) {
  // `row` is a `Book`
}
```
