import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="p-6 bg-[#480ca8]">
      <Link to="/" className="p-2 bg-green-700 rounded-lg m-3 hover:opacity-80 transition-all ease-out" >CHOOSEEEEE</Link>
      <Link to="/playground" className="p-2 bg-red-700 rounded-lg m-3 hover:opacity-80 transition-all ease-out" >Playground</Link>
    </div>
  )
}