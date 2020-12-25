import fauna, { q } from '../../../libs/fauna'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)
  const id = +req.query.id
  const login = req.session.login

  console.time('get item from fauna')
  const note = (await fauna.query(
    q.Get(q.Ref(q.Collection('notes'), id))
  )).data
  console.timeEnd('get item from fauna')

  if (req.method === 'GET') {
    return res.send(JSON.stringify(note))
  }

  if (req.method === 'DELETE') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    console.time('delete item in fauna')
    await fauna.query(
      q.Delete(
        q.Ref(q.Collection('notes'), id)
      )
    )
    console.timeEnd('delete item in fauna')

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: login,
    }
    
    console.time('update item in fauna')
    await fauna.query(
      q.Replace(
        q.Ref(q.Collection('notes'), id),
        { data: updated },
      )
    )
    console.timeEnd('update item in fauna')

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
