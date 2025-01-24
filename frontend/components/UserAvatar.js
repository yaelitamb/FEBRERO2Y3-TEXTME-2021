import { auth } from "../auth"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      <img src={session.user.image} alt="User Avatar" />
      <p>{session.user.email}</p>
      <p>ID Token: {session.token}</p> {/* Solo para pruebas */}
    </div>
  )
}