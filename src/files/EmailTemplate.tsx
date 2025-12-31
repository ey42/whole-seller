import Image from 'next/image'
import React from 'react'

const EmailTemplate = ({firstName = "user", url = "", type}:{firstName: string, url: string, type: string}) => {
    if(type === 'Password Reset'){
  return (
    <div style={{
        backgroundColor: 'white',
        color: 'black',
        fontWeight: 'bold',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',

    }}>
      <h1 style={{
        margin: '0 0 10px 0'
      }}>Hello {firstName},</h1>
      <div style={{marginBottom: '20px'}}>
        <h2 style={{display: 'inline-block', verticalAlign: 'middle', marginRight:'10px'}}>this from eyob whole-seller distrbuter </h2>
        <img style={{ display: 'inline-block', verticalAlign: 'middle' }} src={`http://localhost:3000/ENlogo.png`} alt='logo' width={40} height={40}/>
      </div>
        
      <p >Click the link below👇 to reset your password:</p>
      <p style={{ fontSize: '14px', color: '#666' }}>it redirect to reset password page to reset your password</p>
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <a style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: 'bold'
          }} href={url} >Reset Password📍</a>
      </div>
      
    </div>
  )
}
if(type === 'Welcome Email'){
  return (
    <div>
      <h1>Welcome {firstName}!</h1>
      <p>Thank you for signing up. We're excited to have you on board.</p>
    </div>
  )
}}

export default EmailTemplate
