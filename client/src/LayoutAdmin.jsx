import React from 'react'
import { Outlet } from 'react-router-dom'

export default function LayoutAdmin() {
  return (
    <div>
<h1>Admin Navbar</h1>
{/* component */}

   <Outlet />

        
     <div>
    Footer
     </div>

    </div>
  )
}
