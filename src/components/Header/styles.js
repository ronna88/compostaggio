import styled from 'styled-components'
import { Link } from 'react-router-dom'
export const ContainerHeader = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${(props) => props.theme.green};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`
export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 20px;
`

export const ButtonMenu = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${(props) => props.theme.white};
  max-width: 150px;
  height: 120px;
  padding: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  gap: 8px;

  &:hover {
    color: ${(props) => props.theme.orange};
  }
`
