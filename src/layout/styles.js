import styled from 'styled-components'
import IMGBackground from '../assets/background.jpg'

export const ContainerDefault = styled.div`
  background-image: url(${IMGBackground});
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
