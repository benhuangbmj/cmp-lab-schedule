import { ErrorMessage } from '@hookform/error-message';
export default function InputText({ id, name, utils, options }) {
  const {
    register,
    formState: { errors },
  } = utils;

  return (
    <span style={{ border: '1px solid' }}>
      <input id={id} {...register(name, options)} style={{maxWidth: "100%"}}></input>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ messages }) =>
          messages && <ul>
            {Object.entries(messages).map(([type, message]) => <li style={{ width: 'fit-content', fontSize: '8pt', border: "1px solid", color: 'red' }} key={type}>{message}</li>)}
          </ul>
        } />
    </span>
  )
}