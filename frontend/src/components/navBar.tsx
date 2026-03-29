import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();

  const NavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 transition-all duration-300 font-Manrope ${
      isActive 
        ? "text-slate-900 border-b-2 border-slate-dark font-Manrope-Bold" 
        : "text-slate-400 font-Manrope-Bold hover:text-slate-900"
    }`;

  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-slate-200">
        <Link to='/' className='font-Manrope-ExtraBold text-2xl text-slate-900'>Urbaniva</Link>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/" className={NavLinkClass}>Dashboard</NavLink>
              <NavLink to="/properties" className={NavLinkClass}>Properties</NavLink>
              {user?.role === "Buyer" && <NavLink to="/saved" className={NavLinkClass}>Saved</NavLink>}
              {user?.role === "Broker" && <NavLink to="/add-property" className={NavLinkClass}>Add Property</NavLink>}
            </>
          ) : (
            <>
              <NavLink to="/" className={NavLinkClass}>Home</NavLink>
              <NavLink to="/about" className={NavLinkClass}>About</NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-6 font-Manrope">
          {isAuthenticated ? (
            <>
              <button 
                onClick={logout} 
                className="bg-slate-950 text-gray-100 px-8 py-2.5 rounded-md font-Manrope-SemiBold hover:bg-slate-700 transition"
              >
                Logout
              </button>
            </>
          ) : (<div className="flex gap-4 items-center justify-center">
            <Link 
              to="/login" 
              className="bg-slate-950 text-gray-100 px-8 py-2.5 rounded-md font-Manrope-SemiBold hover:bg-slate-700 transition"
            >
              Login
            </Link>
            <Link 
              to="/register" className=" px-8 py-2.5 rounded-md font-Manrope-SemiBold text-gray-600 hover:text-gray-900 transition">Register</Link>
              </div>
          )}
        </div>
    </nav>
  )
}

export default NavBar