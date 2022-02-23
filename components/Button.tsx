type Props = {
  disabled: boolean
  onClick: () => void
  children?: React.ReactNode
}

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
}

export default function Button(props: Props) {
  const { onClick, children, disabled } = props
  return (
    <button
      className={`
        border rounded p-2
        ${disabled ? 'bg-slate-200' : 'bg-green-300'}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
