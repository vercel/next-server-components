import fauna, { q } from '../../../libs/fauna'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)

  if (req.method === 'GET') {
    console.time('get all items from fauna')
    const notes = (await fauna.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("updated_at_desc")), { size: 40 }
        ),
        q.Lambda(["updated_at", "ref"], q.Get(q.Var("ref")))
      )
    )).data
    console.timeEnd('get all items from fauna')

    return res.send(JSON.stringify(notes.map(n => n.data)))
  }

  if (req.method === 'POST') {
    const login = req.session.login

    if (!login) {
      return res.status(403).send('Unauthorized')
    }

    const id = Date.now()
    const newNote = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: login,
    }

    console.time('create item in fauna')
    await fauna.query(q.Create(q.Ref(q.Collection('notes'), id), { data: newNote }))
    console.timeEnd('create item in fauna')

    return sendRes(req, res, id)
  }

  return res.send('Method not allowed.')
}
