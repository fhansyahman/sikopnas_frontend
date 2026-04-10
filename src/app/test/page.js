'use client';
import { useState, useEffect } from 'react';

export default function TokenDebug() {
  const [localResult, setLocalResult] = useState(null);
  const [ngrokResult, setNgrokResult] = useState(null);

  useEffect(() => {
    compareTokens();
  }, []);

  const compareTokens = async () => {
    const token = localStorage.getItem('token');
    console.log('🔐 Current Token:', token);
    
    if (!token) {
      console.log('❌ No token found');
      return;
    }

    // Decode token untuk melihat payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📋 Token Payload:', payload);
    } catch (e) {
      console.log('❌ Cannot decode token');
    }

    // Test ke localhost backend
    try {
      const localResponse = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const localData = await localResponse.json();
      setLocalResult(localData);
      console.log('✅ Localhost response:', localData);
    } catch (error) {
      console.error('❌ Localhost failed:', error);
      setLocalResult({ error: error.message });
    }

    // Test ke ngrok backend  
    try {
      const ngrokResponse = await fetch('https://guarded-comfily-chu.ngrok-free.dev/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ngrokData = await ngrokResponse.json();
      setNgrokResult(ngrokData);
      console.log('✅ Ngrok response:', ngrokData);
    } catch (error) {
      console.error('❌ Ngrok failed:', error);
      setNgrokResult({ error: error.message });
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
      <h3>🔍 Token Debug - Localhost vs Ngrok</h3>
      <button onClick={compareTokens}>Test Both Connections</button>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, padding: '10px', border: '1px solid blue' }}>
          <h4>Localhost:5000</h4>
          <pre>{JSON.stringify(localResult, null, 2)}</pre>
        </div>
        
        <div style={{ flex: 1, padding: '10px', border: '1px solid green' }}>
          <h4>Ngrok</h4>
          <pre>{JSON.stringify(ngrokResult, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}