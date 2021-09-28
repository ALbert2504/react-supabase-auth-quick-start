import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Form,  Button, FormGroup, FormControl } from 'react-bootstrap';
import Avatar from './Avatar';


function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  console.log(session);

  useEffect(() => {
    getProfile();
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form className="form-widget">
      <Avatar
        url={avatar_url}
        size={250}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ username, website, avatar_url: url })
        }}
      />
      <FormGroup className="mt-3 border rounded p-4">
        <label htmlFor="email">Email</label>
        <FormControl id="email" type="text" value={session.user.email} disabled />
      </FormGroup>
      <FormGroup className="mt-3 border rounded p-4">
        <label htmlFor="username">Name</label>
        <FormControl
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup className="mt-3 border rounded p-4">
        <label htmlFor="website">Website</label>
        <FormControl
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </FormGroup>

      <div>
        <Button
          className="d-block w-100 mt-2"
          variant="info"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </div>

      <div>
        <Button className="d-block w-100 mt-2" variant="secondary" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </div>
    </Form>
  )
};

export default Account;