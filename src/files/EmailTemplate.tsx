
const EmailTemplate = ({firstName = "user", url = "", body, email,type}:{firstName?: string, url?: string, type: string, body?: string, email?: string}) => {
    if(type === 'request-reset-password'){
  return (
    <div style={{
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',

    }}>
      <h1 style={{
        margin: '0 0 10px 0'
      }}>Hello {firstName},</h1>
      <div style={{marginBottom: '20px'}}>
        <h2 style={{display: 'inline-block', verticalAlign: 'middle', marginRight:'10px'}}>this from eyob whole-seller distrbuter 🛒</h2>
        {/* <img style={{ display: 'inline-block', verticalAlign: 'middle' }} src={`http://localhost:3000/ENlogo.png`} alt='logo' width={40} height={40}/> */}
      </div>
        
      <p style={{ fontSize: '14px', color: 'green' }}>Click the Reset Password button below👇 to reset your password:</p>
      <p style={{ fontSize: '14px', color: 'green' }}>it redirect to reset password page to reset your password</p>
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <a style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '14px'
          }} href={url} >Reset Password📍</a>
      </div>
      
    </div>
  )
}
if(type === 'contact'){
  return (
    <div style={{
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
      }}>
      <h1 style={{
        marginBottom: '20 px'
      }}>EN Whole-seller.com contact issue ⚙</h1>
      <h2 style={{
        color: "white",
        fontSize: "16px",
        textDecoration: "none"
      }}>message from {email}</h2>
      <h3 style={{
        fontSize: "14px",
        color: "green"
      }}>{body}</h3>
    </div>
  )
}}

export default EmailTemplate
