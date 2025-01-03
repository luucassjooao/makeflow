interface IProps {
  children: JSX.Element | JSX.Element[];
  error: string;
}

export default function FormGroup({ children, error }: IProps) {
  return (
    <div>
      <div className="relative">
        {children}
      </div>
      <div style={{ maxWidth: 200 }} className="text-center" >
        {error && (<small className="block text-red-600" >{error}</small>)}
      </div>
    </div>
  )
}