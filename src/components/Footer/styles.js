import styled from 'styled-components'

export const ContainerFooter = styled.footer`
  width: 100%;
  height: 70px;
  color: ${(props) => props.theme.white};
  background: ${(props) => props.theme.orange};
  font-weight: bold;
  display: flex;
  justify-content: space-between;

  p {
    margin: 16px;
  }
`
export const ContainerLinks = styled.div`
  display: flex;
  gap: 8px;
`
