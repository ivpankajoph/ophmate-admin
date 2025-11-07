import VariantSection from './VariantSection'

export default function SpecificationSection({ state, actions }: any) {
  // Reuse the same component, could later be split if different specs needed
  return <VariantSection state={state} actions={actions} />
}
