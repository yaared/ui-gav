import { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import './App.css'

const BASE_URL = 'https://web-production-371f.up.railway.app';

interface Option {
  value: string
  label: string
}

function App() {
  const [options1, setOptions1] = useState<Option[]>([])
  const [options2, setOptions2] = useState<Option[]>([])
  const [options3, setOptions3] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected1, setSelected1] = useState<Option | null>(null)
  const [selected2, setSelected2] = useState<Option | null>(null)
  const [selected3, setSelected3] = useState<Option | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        const [response1, response2, response3] = await Promise.all([
          axios.get(`${BASE_URL}/parents`),
          axios.get(`${BASE_URL}/investors`),
          axios.get(`${BASE_URL}/funds`)
        ])

        console.log('Response 1 (parents):', response1.data)
        console.log('Response 2 (investors):', response2.data)
        console.log('Response 3 (funds):', response3.data)

        // Transform the data into the format react-select expects
        setOptions1(response1.data.map((item: any) => ({ 
          value: item.Parent, 
          label: item.Parent 
        })))
        setOptions2(response2.data.map((item: any) => ({ 
          value: item.Investor || '', 
          label: item.Investor || ''
        })))
        setOptions3(response3.data.map((item: any) => ({ 
          value: item.Fund || '', 
          label: item.Fund || ''
        })))

        console.log('Transformed options1:', options1)
        console.log('Transformed options2:', options2)
        console.log('Transformed options3:', options3)
        
      } catch (err) {
        setError('Failed to fetch options')
        console.error('Error fetching options:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [])

  if (loading) return <div className="container">Loading...</div>
  if (error) return <div className="container">Error: {error}</div>

  return (
    <div className="container">
      <h1>GAV Calculator</h1>
      <div className="dropdowns">
        <div className="dropdown">
          <label>Parents</label>
          <Select
            options={options1}
            value={selected1}
            onChange={(option) => setSelected1(option)}
            isSearchable
            placeholder="Select parent..."
          />
        </div>
        <div className="dropdown">
          <label>Investors</label>
          <Select
            options={options2}
            value={selected2}
            onChange={(option) => setSelected2(option)}
            isSearchable
            placeholder="Select investor..."
          />
        </div>
        <div className="dropdown">
          <label>Funds</label>
          <Select
            options={options3}
            value={selected3}
            onChange={(option) => setSelected3(option)}
            isSearchable
            placeholder="Select fund..."
          />
        </div>
      </div>
    </div>
  )
}

export default App
