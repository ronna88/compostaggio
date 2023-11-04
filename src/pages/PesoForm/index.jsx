import { useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export function PesoForm({ ilhas, lixeiras }) {
  const [rota, setRota] = useState('')
  const [peso, setPeso] = useState('')
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()

  const firestore = getFirestore(app)

  const salvarRota = () => {
    event.preventDefault()

    const novaRota = {
      peso,
      date,
    }

    if (!peso || !date) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }

    console.log(novaRota)
    addDoc(collection(firestore, 'rotas'), novaRota).then((docRef) => {
      console.log(docRef.id)
    })

    limpaEstados()
    navigate('/busca')
  }

  const limpaEstados = () => {
    setRota('')
    setDate('')
    setPeso('')
  }

  useEffect(() => {
    if (date != '') {
      setDate(new Date())
    }
  }, [])

  return (
    <div className="container mt-2 pt-2">
      <div className="card mt-2 p-4">
        <div className="card-header">
          <h3>Pesagem lixeira</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <label className="form-label">Peso em Kg da Lixeira</label>
              <input
                type="text"
                className="form-control"
                placeholder="Peso em Kg da Lixeira"
                onChange={(e) => {
                  setPeso(e.target.value)
                }}
                value={peso}
              />
            </div>
            <div className="mb-3 react-datepicker-wrapper">
              <label className="form-label">Data e Hora da Pesagem</label>
              <ReactDatePicker
                className="form-control "
                selected={date}
                onChange={(date) => setDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
              />
            </div>

            <button onClick={salvarRota} className="btn btn-primary">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
