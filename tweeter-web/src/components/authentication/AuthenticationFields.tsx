interface Props {
  setA : (event: React.ChangeEvent<HTMLInputElement>) => void;
  setP : (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthenticationFields = (props : Props) => {
  return (
    <>
      <div className="form-floating">
      <input
        type="text"
        className="form-control"
        size={50}
        id="aliasInput"
        placeholder="name@example.com"
        onChange={props.setA}  
      />
      <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
      <input
        type="password"
        className="form-control bottom"
        id="passwordInput"
        placeholder="Password"
        onChange={props.setP}
      />
      <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  )
};

export default AuthenticationFields;
