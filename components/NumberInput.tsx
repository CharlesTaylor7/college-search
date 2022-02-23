type Props = {
  defaultValue?: number
  autoFocus?: boolean
  onChange: (n: number) => void
}

NumberInput.defaultProps = {
  onChange: () => {},
}

export default function NumberInput(props: Props) {
  const { onChange, defaultValue, autoFocus } = props
  return (
    <input
      className="border rounded border-slate-300 text-center w-20 mx-2 px-2"
      type="number"
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
