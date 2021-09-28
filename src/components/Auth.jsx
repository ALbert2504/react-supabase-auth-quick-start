import React, { useState } from 'react';
import { Row, Col, FormControl, Button } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    };
  }

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    };
  }



  return (
    <Row className="align-items-center justify-content-center">
      <Col xs={6}>
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in via magic link with your email below</p>
        <div>
          <FormControl
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <FormControl
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault()
              handleSignUp(email, password)
            }}
            disabled={loading}
            variant="primary"
            size="lg"
            className="mt-2 d-block"
          >
            {loading ? <span>Loading</span> : <span>Sign Up</span>}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email, password)
            }}
            disabled={loading}
            variant="primary"
            size="lg"
            className="mt-2 d-block"
          >
            {loading ? <span>Loading</span> : <span>Log In</span>}
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Auth;