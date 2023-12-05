import { useEffect, useState } from 'react'
import { Container, SelectLixeiraFiltrada } from './styles'

export function TableFilteredLixeiras({
  lixeiras,
  ilhas,
  nomeLixeira,
  idLixeira,
  lixeira,
  setLixeira,
}) {
  const [loading, setLoading] = useState(true)
  // const [lixeiraFilha, setLixeiraFilha] = useState()

  const filterLixeiraById = (idLixeira) => {
    return [lixeiras.find((i) => i.id === idLixeira)]
  }

  const filterLixeiraByNome = (nomeLixeira) => {
    return lixeiras.filter((lix) => lix.nome.includes(nomeLixeira))
  }

  useEffect(() => {
    setTimeout(() => {
      if (ilhas && lixeiras) {
        setLoading(false)
      }
    }, 2000)
  }, [lixeiras, ilhas])

  const filterNomeIlha = (ilhaId) => {
    const ilha = ilhas.find((i) => i.id === ilhaId)
    if (ilha) {
      return ilha.nome
    }
  }

  const verifica = (nomeLixeira, idLixeira) => {
    console.log('entrou 1')
    if (nomeLixeira !== '') {
      console.log('entrou 2')
      return filterLixeiraByNome(nomeLixeira)
    }
    console.log('passou nome lixeira')
    if (idLixeira !== '') {
      console.log('idLixeira: ' + idLixeira)
      return filterLixeiraById(idLixeira)
    }
  }

  useEffect(() => {
    console.log(nomeLixeira)
    console.log(idLixeira)
  }, [nomeLixeira, idLixeira])

  return (
    <Container>
      <h6>Selecione a Lixeira &nbsp;</h6>
      <SelectLixeiraFiltrada
        value={lixeira}
        onChange={(e) => setLixeira(e.target.value)}
      >
        <option>Selecione a lixeira</option>
        {nomeLixeira !== '' && idLixeira !== '' ? (
          <option>Sem dados</option>
        ) : (
          verifica(nomeLixeira, idLixeira)?.map((l) => {
            return (
              <option key={l?.id} value={l?.id}>
                {l?.nome} - Ilha: {filterNomeIlha(l?.ilha)}
              </option>
            )
          })
        )}
      </SelectLixeiraFiltrada>
    </Container>
  )
}
