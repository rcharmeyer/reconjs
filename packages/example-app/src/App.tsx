import { createScope, useScopedState } from 'react-scoped-hooks'

const SectionScope = createScope()

function Counter() {
	const [ count, setCount ] = useScopedState ("count", () => {
		return 0
	}, [ SectionScope ])

	function onClick () {
		setCount (count + 1)
	}

	return (
		<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onClick}>
			Count is {count}
		</button>
	)
}

function Section () {
	return (
		<div className="bg-white p-8 rounded-lg shadow-md">
			<SectionScope>
				<Counter />
				<Counter />
			</SectionScope>
		</div>
	)
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">React Scoped Hooks Example</h1>
      </div>
			<Section />
			<Section />
    </div>
  )
}
