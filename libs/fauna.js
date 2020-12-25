const faunadb = require('faunadb')

export default new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
export const q = faunadb.query
